#!/usr/bin/env node

import { createServer } from 'node:http';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(new URL('../..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const LIB_ROOT = path.join(ROOT, 'projects', 'integra-ng', 'src');
const UI_DEMO_ROOT = path.join(ROOT, 'projects', 'ui-kit', 'src', 'app', 'components');
const PUBLIC_API = path.join(LIB_ROOT, 'public-api.ts');
const DEFAULT_STATIC_CATALOG_PATH = path.join(ROOT, 'dist', 'mcp', 'integra-ng-catalog.json');
const PROTOCOL_VERSION = '2024-11-05';

const textEncoder = new TextEncoder();

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function relativeFromRoot(filePath) {
  return toPosix(path.relative(ROOT, filePath));
}

function normalizeWhitespace(value) {
  return value.replace(/\r\n/g, '\n').replace(/[ \t]+\n/g, '\n').trim();
}

function kebabToTitle(value) {
  return value
    .replace(/^\[|\]$/g, '')
    .replace(/^i-/, '')
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function classToTitle(value) {
  return value
    .replace(/^I(?=[A-Z])/, '')
    .replace(/Component$|Directive$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim();
}

function parseArgs(argv) {
  const args = {
    mode: 'stdio',
    host: process.env.INTEGRA_NG_MCP_HOST || '127.0.0.1',
    port: Number(process.env.INTEGRA_NG_MCP_PORT || 3200),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--http') args.mode = 'http';
    if (arg === '--stdio') args.mode = 'stdio';
    if (arg === '--host') args.host = argv[++index] || args.host;
    if (arg === '--port') args.port = Number(argv[++index] || args.port);
  }

  return args;
}

async function walk(directory, predicate = () => true) {
  const entries = [];

  async function visit(current) {
    let children = [];
    try {
      children = await readdir(current);
    } catch {
      return;
    }

    for (const child of children) {
      const childPath = path.join(current, child);
      const info = await stat(childPath);
      if (info.isDirectory()) {
        await visit(childPath);
      } else if (predicate(childPath)) {
        entries.push(childPath);
      }
    }
  }

  await visit(directory);
  return entries.sort();
}

async function readOptional(filePath) {
  try {
    return await readFile(filePath, 'utf8');
  } catch {
    return '';
  }
}

function resolveCatalogPath(filePath = process.env.INTEGRA_NG_MCP_CATALOG_PATH || DEFAULT_STATIC_CATALOG_PATH) {
  return path.isAbsolute(filePath) ? filePath : path.join(ROOT, filePath);
}

async function readStaticCatalog(filePath = resolveCatalogPath()) {
  const text = await readOptional(filePath);
  if (!text) return null;

  const catalog = JSON.parse(text);
  return {
    ...catalog,
    catalogSource: 'static',
    catalogPath: relativeFromRoot(filePath),
  };
}

async function fileExists(filePath) {
  try {
    const info = await stat(filePath);
    return info.isFile();
  } catch {
    return false;
  }
}

function parsePublicExports(publicApiText) {
  const exports = new Map();
  const exportRegex = /export\s+(?:type\s+)?(?:\{[^}]+\}\s+from\s+)?\*\s+from\s+['"]([^'"]+)['"]|export\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;

  for (const match of publicApiText.matchAll(exportRegex)) {
    const specifier = match[1] || match[3];
    if (!specifier) continue;
    const normalized = specifier.replace(/^\.\//, '');
    const fullPath = path.join(LIB_ROOT, `${normalized}.ts`);
    exports.set(path.normalize(fullPath), {
      specifier,
      symbols: match[2]?.split(',').map((symbol) => symbol.trim()) || ['*'],
    });
  }

  return exports;
}

function extractDecoratorBody(source, decoratorName) {
  const start = source.indexOf(`@${decoratorName}(`);
  if (start === -1) return '';

  const bodyStart = source.indexOf('(', start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (depth === 0) return source.slice(bodyStart + 1, index);
  }

  return '';
}

function parseSelector(source) {
  const decorator = extractDecoratorBody(source, 'Component') || extractDecoratorBody(source, 'Directive');
  const selector = decorator.match(/selector\s*:\s*['"`]([^'"`]+)['"`]/)?.[1];
  return selector || '';
}

function parseClassName(source) {
  return source.match(/export\s+(?:abstract\s+)?class\s+([A-Za-z0-9_]+)/)?.[1] || '';
}

function parseInputOutputLine(lines, index, decoratorName) {
  const line = lines[index];
  const trimmedLine = line.trim();
  if (!trimmedLine.startsWith(`@${decoratorName}`)) return null;

  const decoratorMatch = trimmedLine.match(new RegExp(`@${decoratorName}\\s*(?:\\(([^)]*)\\))?`));
  const decoratorArgs = decoratorMatch?.[1]?.trim() || '';
  let declaration = trimmedLine.slice(decoratorMatch?.[0]?.length || 0).trim();

  if (!declaration) {
    for (let next = index + 1; next < lines.length; next += 1) {
      const candidate = lines[next].trim();
      if (!candidate || candidate.startsWith('//') || candidate.startsWith('*') || candidate.startsWith('@')) continue;
      declaration = candidate;
      break;
    }
  }

  const propMatch = declaration.match(/^(?:public\s+|readonly\s+|set\s+|get\s+)?([A-Za-z0-9_$]+)\??\s*(?::\s*([^=;{]+))?\s*(?:=\s*([^;]+))?/);
  if (!propMatch) return null;

  const alias = decoratorArgs.match(/^['"`]([^'"`]+)['"`]$/)?.[1] || decoratorArgs.match(/alias\s*:\s*['"`]([^'"`]+)['"`]/)?.[1];
  return {
    name: propMatch[1],
    binding: alias || propMatch[1],
    type: propMatch[2]?.trim() || undefined,
    default: propMatch[3]?.trim() || undefined,
    required: /required\s*:\s*true/.test(decoratorArgs),
    transform: decoratorArgs.match(/transform\s*:\s*([A-Za-z0-9_$]+)/)?.[1],
  };
}

function parseInputsOutputs(source) {
  const lines = source.split(/\r?\n/);
  const inputs = [];
  const outputs = [];

  for (let index = 0; index < lines.length; index += 1) {
    const input = parseInputOutputLine(lines, index, 'Input');
    if (input) inputs.push(input);

    const output = parseInputOutputLine(lines, index, 'Output');
    if (output) outputs.push(output);
  }

  const signalInputRegex = /^\s*(?:readonly\s+)?([A-Za-z0-9_$]+)\s*:\s*InputSignal<([^>]+)>\s*=\s*input(?:\.(required))?(?:<[^>]+>)?\(([^;]*)\);/gm;
  for (const match of source.matchAll(signalInputRegex)) {
    if (!inputs.some((input) => input.binding === match[1])) {
      inputs.push({
        name: match[1],
        binding: match[1],
        type: match[2].trim(),
        default: match[4]?.trim() || undefined,
        required: Boolean(match[3]),
      });
    }
  }

  return { inputs, outputs };
}

function parseTemplateSlots(templateText) {
  return [...templateText.matchAll(/<ng-content(?:\s+select=["']([^"']+)["'])?\s*><\/ng-content>|<ng-content(?:\s+select=["']([^"']+)["'])?\s*\/>/g)]
    .map((match) => match[1] || match[2] || 'default')
    .filter(Boolean);
}

function findMatchingTagEnd(text, startIndex, selector) {
  const startTagEnd = text.indexOf('>', startIndex);
  if (startTagEnd === -1) return -1;

  const startTag = text.slice(startIndex, startTagEnd + 1);
  if (/\/>\s*$/.test(startTag)) return startTagEnd + 1;

  const closeTag = `</${selector}>`;
  const closeIndex = text.indexOf(closeTag, startTagEnd + 1);
  if (closeIndex === -1) return startTagEnd + 1;
  return closeIndex + closeTag.length;
}

function extractElementExamples(text, selector, limit = 5) {
  const examples = [];
  const tagRegex = new RegExp(`<${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');

  for (const match of text.matchAll(tagRegex)) {
    const end = findMatchingTagEnd(text, match.index, selector);
    if (end === -1) continue;
    const snippet = normalizeWhitespace(text.slice(match.index, end));
    if (snippet && !examples.includes(snippet)) examples.push(snippet);
    if (examples.length >= limit) break;
  }

  return examples;
}

function extractDirectiveExamples(text, directiveName, limit = 5) {
  const examples = [];
  const attrRegex = new RegExp(`<[^>]+\\b${directiveName}\\b[^>]*>`, 'g');

  for (const match of text.matchAll(attrRegex)) {
    const snippet = normalizeWhitespace(match[0]);
    if (snippet && !examples.includes(snippet)) examples.push(snippet);
    if (examples.length >= limit) break;
  }

  return examples;
}

function extractBacktickExamples(text, needle, limit = 5) {
  const examples = [];
  const parts = text.split('`');

  for (let index = 1; index < parts.length; index += 2) {
    const snippet = normalizeWhitespace(parts[index]);
    if (snippet.includes(needle) && !examples.includes(snippet)) examples.push(snippet);
    if (examples.length >= limit) break;
  }

  return examples;
}

async function collectExamples(selector) {
  const files = await walk(UI_DEMO_ROOT, (filePath) => /\.(html|ts)$/.test(filePath));
  const isDirective = selector.startsWith('[') && selector.endsWith(']');
  const needle = isDirective ? selector.slice(1, -1) : `<${selector}`;
  const examples = [];

  for (const filePath of files) {
    const text = await readOptional(filePath);
    const snippets = isDirective
      ? [...extractDirectiveExamples(text, selector.slice(1, -1)), ...extractBacktickExamples(text, selector.slice(1, -1))]
      : [...extractElementExamples(text, selector), ...extractBacktickExamples(text, needle)];

    for (const snippet of snippets) {
      if (!examples.some((example) => example.code === snippet)) {
        examples.push({
          source: relativeFromRoot(filePath),
          code: snippet.length > 1800 ? `${snippet.slice(0, 1800).trimEnd()}\n...` : snippet,
        });
      }
      if (examples.length >= 8) return examples;
    }
  }

  return examples;
}

function buildUsageMarkdown(item) {
  const lines = [
    `# ${item.displayName}`,
    '',
    `Import from \`integra-ng\`: \`${item.exportName}\`.`,
    `Selector: \`${item.selector}\`.`,
    `Source: \`${item.sourcePath}\`.`,
  ];

  if (item.formsSupport) {
    lines.push('', 'Supports Angular forms APIs such as `ngModel`, `formControl`, or `formControlName`.');
  }

  if (item.id === 'i-layout') {
    lines.push(
      '',
      '## Theme Initialization',
      'When using the built-in light/dark theme toggle, initialize the body theme class before Angular bootstraps. Add this script after `</body>` in `src/index.html` so first paint uses the saved `viewModeColorScheme` value or `light` by default:',
      '```html',
      '<script>',
      '  const colorSchemeSet = localStorage.getItem("viewModeColorScheme") || "light";',
      '  document.body.classList.add(colorSchemeSet === "dark" ? "dark" : "light");',
      '</script>',
      '```'
    );
  }

  if (item.inputs.length) {
    lines.push('', '## Inputs');
    for (const input of item.inputs) {
      const required = input.required ? ' required' : '';
      const type = input.type ? `: ${input.type}` : '';
      const defaultValue = input.default ? ` = ${input.default}` : '';
      lines.push(`- \`${input.binding}\`${type}${defaultValue}${required}`);
    }
  }

  if (item.outputs.length) {
    lines.push('', '## Outputs');
    for (const output of item.outputs) {
      const type = output.type ? `: ${output.type}` : '';
      lines.push(`- \`${output.binding}\`${type}`);
    }
  }

  if (item.slots.length) {
    lines.push('', '## Content Slots');
    for (const slot of item.slots) lines.push(`- \`${slot}\``);
  }

  if (item.examples.length) {
    lines.push('', '## Examples');
    for (const example of item.examples.slice(0, 3)) {
      lines.push('', `From \`${example.source}\`:`, '```html', example.code, '```');
    }
  }

  if (item.relatedFiles.length) {
    lines.push('', '## Related Files');
    for (const file of item.relatedFiles) lines.push(`- \`${file}\``);
  }

  return lines.join('\n');
}

export async function buildCatalogFromSource() {
  const publicApiText = await readOptional(PUBLIC_API);
  const publicExports = parsePublicExports(publicApiText);
  const candidateFiles = await walk(path.join(LIB_ROOT, 'lib'), (filePath) => /\.(component|directive)\.ts$/.test(filePath));
  const components = [];

  for (const filePath of candidateFiles) {
    const source = await readOptional(filePath);
    const selector = parseSelector(source);
    if (!selector) continue;

    const className = parseClassName(source);
    const exportInfo = publicExports.get(path.normalize(filePath));
    const relativePath = relativeFromRoot(filePath);
    const templatePath = filePath.replace(/\.ts$/, '.html');
    const stylePath = filePath.replace(/\.ts$/, '.scss');
    const themePath = filePath.replace(/\.ts$/, '.theme.scss');
    const templateText = await readOptional(templatePath);
    const { inputs, outputs } = parseInputsOutputs(source);
    const examples = await collectExamples(selector);
    const kind = source.includes('@Directive') ? 'directive' : 'component';
    const name = selector.replace(/^\[|\]$/g, '');
    const relatedFiles = [];
    for (const relatedPath of [templatePath, stylePath, themePath]) {
      if (relatedPath !== filePath && await fileExists(relatedPath)) {
        relatedFiles.push(relativeFromRoot(relatedPath));
      }
    }

    components.push({
      id: name,
      displayName: className ? classToTitle(className) : kebabToTitle(selector),
      kind,
      selector,
      exportName: className || kebabToTitle(selector).replace(/\s/g, ''),
      publicApi: Boolean(exportInfo),
      publicApiSpecifier: exportInfo?.specifier,
      sourcePath: relativePath,
      inputs,
      outputs,
      slots: parseTemplateSlots(templateText),
      formsSupport: /ControlValueAccessor|NG_VALUE_ACCESSOR|writeValue\s*\(/.test(source),
      examples,
      relatedFiles,
    });
  }

  components.sort((a, b) => a.selector.localeCompare(b.selector));

  const exportedComponents = components.filter((component) => component.publicApi);
  return {
    generatedAt: new Date().toISOString(),
    packageName: 'integra-ng',
    importFrom: 'integra-ng',
    catalogSource: 'source',
    componentCount: components.length,
    exportedComponentCount: exportedComponents.length,
    components,
  };
}

export async function writeStaticCatalog(filePath = resolveCatalogPath()) {
  const catalog = await buildCatalogFromSource();
  const outputCatalog = {
    ...catalog,
    catalogSource: 'static',
    catalogPath: relativeFromRoot(filePath),
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(outputCatalog, null, 2)}\n`, 'utf8');
  return outputCatalog;
}

export async function loadCatalog(options = {}) {
  const forceSource = Boolean(options.forceSource) || process.env.INTEGRA_NG_MCP_CATALOG_MODE === 'source';

  if (!forceSource) {
    const staticCatalog = await readStaticCatalog(resolveCatalogPath());
    if (staticCatalog) return staticCatalog;
  }

  return buildCatalogFromSource();
}

function summarizeComponent(component) {
  return {
    id: component.id,
    name: component.displayName,
    kind: component.kind,
    selector: component.selector,
    import: component.exportName,
    publicApi: component.publicApi,
    inputs: component.inputs.map((input) => input.binding),
    outputs: component.outputs.map((output) => output.binding),
    formsSupport: component.formsSupport,
    examples: component.examples.length,
  };
}

async function listComponents(args = {}) {
  const catalog = await loadCatalog();
  const includePrivate = Boolean(args.includePrivate);
  return catalog.components
    .filter((component) => includePrivate || component.publicApi)
    .map(summarizeComponent);
}

async function findComponent(identifier) {
  const catalog = await loadCatalog();
  const normalized = String(identifier || '').toLowerCase();
  const component = catalog.components.find((item) => (
    item.id.toLowerCase() === normalized ||
    item.selector.toLowerCase() === normalized ||
    item.displayName.toLowerCase() === normalized ||
    item.exportName.toLowerCase() === normalized
  ));

  if (!component) {
    const available = catalog.components.map((item) => item.selector).join(', ');
    throw new Error(`Unknown integra-ng component "${identifier}". Available selectors: ${available}`);
  }

  return component;
}

async function getComponentUsage(args = {}) {
  const component = await findComponent(args.component || args.selector || args.name);
  const format = args.format || 'markdown';
  if (format === 'json') return component;
  return buildUsageMarkdown(component);
}

async function searchComponents(args = {}) {
  const catalog = await loadCatalog();
  const query = String(args.query || '').toLowerCase();
  const results = catalog.components
    .map((component) => {
      const haystack = [
        component.displayName,
        component.selector,
        component.exportName,
        ...component.inputs.map((input) => input.binding),
        ...component.outputs.map((output) => output.binding),
        ...component.examples.map((example) => example.code),
      ].join(' ').toLowerCase();

      let score = 0;
      if (component.selector.toLowerCase() === query) score += 20;
      if (component.id.toLowerCase().includes(query)) score += 10;
      if (component.displayName.toLowerCase().includes(query)) score += 8;
      if (haystack.includes(query)) score += 3;
      return { component, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.component.selector.localeCompare(b.component.selector))
    .slice(0, Number(args.limit || 10))
    .map((result) => summarizeComponent(result.component));

  return results;
}

async function getOverview() {
  const catalog = await loadCatalog();
  return {
    packageName: catalog.packageName,
    importFrom: catalog.importFrom,
    catalogSource: catalog.catalogSource,
    catalogPath: catalog.catalogPath,
    componentCount: catalog.componentCount,
    exportedComponentCount: catalog.exportedComponentCount,
    usage: [
      'Import standalone components/directives from integra-ng.',
      'Use list_components to discover selectors and exported names.',
      'Use get_component_usage for inputs, outputs, projected content slots, and UI-kit examples.',
      'Use search_components when you know a behavior, input, output, or partial selector.',
    ],
  };
}

const tools = [
  {
    name: 'list_components',
    description: 'List every integra-ng Angular component/directive known to the MCP catalog.',
    inputSchema: {
      type: 'object',
      properties: {
        includePrivate: {
          type: 'boolean',
          description: 'Include selector-bearing artifacts that are not exported from the public API.',
          default: false,
        },
      },
    },
  },
  {
    name: 'get_component_usage',
    description: 'Return usage guidance for one integra-ng component/directive, including imports, selector, inputs, outputs, slots, source files, and examples from the UI kit.',
    inputSchema: {
      type: 'object',
      properties: {
        component: {
          type: 'string',
          description: 'Selector, id, display name, or exported class name, such as i-button, button, or IButton.',
        },
        format: {
          type: 'string',
          enum: ['markdown', 'json'],
          default: 'markdown',
        },
      },
      required: ['component'],
    },
  },
  {
    name: 'search_components',
    description: 'Search integra-ng components by selector, display name, exported class, inputs, outputs, and demo usage snippets.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'number', default: 10 },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_library_overview',
    description: 'Describe how AI agents should use the integra-ng UI component library through this MCP server.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name, args) {
  if (name === 'list_components') return listComponents(args);
  if (name === 'get_component_usage') return getComponentUsage(args);
  if (name === 'search_components') return searchComponents(args);
  if (name === 'get_library_overview') return getOverview();
  throw new Error(`Unknown tool "${name}"`);
}

async function listResources() {
  const catalog = await loadCatalog();
  return [
    {
      uri: 'integra-ng://catalog',
      name: 'integra-ng component catalog',
      mimeType: 'application/json',
      description: 'Full generated catalog of all selector-bearing components and directives.',
    },
    {
      uri: 'integra-ng://overview',
      name: 'integra-ng overview',
      mimeType: 'application/json',
      description: 'Short guidance for agents using the component library.',
    },
    ...catalog.components.map((component) => ({
      uri: `integra-ng://component/${component.id}`,
      name: component.displayName,
      mimeType: 'text/markdown',
      description: `${component.selector} usage guide`,
    })),
  ];
}

async function readResource(uri) {
  if (uri === 'integra-ng://catalog') {
    return JSON.stringify(await loadCatalog(), null, 2);
  }
  if (uri === 'integra-ng://overview') {
    return JSON.stringify(await getOverview(), null, 2);
  }
  const componentMatch = uri.match(/^integra-ng:\/\/component\/(.+)$/);
  if (componentMatch) {
    return getComponentUsage({ component: componentMatch[1], format: 'markdown' });
  }
  throw new Error(`Unknown resource "${uri}"`);
}

function listPrompts() {
  return [
    {
      name: 'use_integra_ng_component',
      description: 'Guide an agent to choose and implement integra-ng components correctly.',
      arguments: [
        {
          name: 'goal',
          description: 'The UI task or component behavior to build.',
          required: true,
        },
      ],
    },
  ];
}

function getPrompt(name, args = {}) {
  if (name !== 'use_integra_ng_component') {
    throw new Error(`Unknown prompt "${name}"`);
  }

  return {
    description: 'Use integra-ng components with source-backed usage guidance.',
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: [
            `Goal: ${args.goal || 'Build an Angular UI using integra-ng.'}`,
            '',
            'First call list_components or search_components to choose the right selector.',
            'Then call get_component_usage for every selected component.',
            'Import standalone components from integra-ng and follow the documented inputs, outputs, slots, and examples.',
          ].join('\n'),
        },
      },
    ],
  };
}

function jsonRpcResult(id, result) {
  return { jsonrpc: '2.0', id, result };
}

function jsonRpcError(id, error) {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: -32000,
      message: error instanceof Error ? error.message : String(error),
    },
  };
}

async function handleRequest(message) {
  if (!message || typeof message !== 'object') {
    return jsonRpcError(null, new Error('Invalid JSON-RPC message.'));
  }

  const { id, method, params = {} } = message;

  try {
    if (method === 'initialize') {
      return jsonRpcResult(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
        serverInfo: {
          name: 'integra-ng-mcp',
          version: '1.0.0',
        },
      });
    }

    if (method === 'notifications/initialized') return undefined;
    if (method === 'ping') return jsonRpcResult(id, {});
    if (method === 'tools/list') return jsonRpcResult(id, { tools });
    if (method === 'tools/call') {
      const result = await callTool(params.name, params.arguments || {});
      const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
      return jsonRpcResult(id, {
        content: [{ type: 'text', text }],
      });
    }
    if (method === 'resources/list') return jsonRpcResult(id, { resources: await listResources() });
    if (method === 'resources/read') {
      const text = await readResource(params.uri);
      return jsonRpcResult(id, {
        contents: [{
          uri: params.uri,
          mimeType: params.uri?.startsWith('integra-ng://component/') ? 'text/markdown' : 'application/json',
          text,
        }],
      });
    }
    if (method === 'prompts/list') return jsonRpcResult(id, { prompts: listPrompts() });
    if (method === 'prompts/get') return jsonRpcResult(id, getPrompt(params.name, params.arguments || {}));

    return jsonRpcError(id, new Error(`Unsupported method "${method}"`));
  } catch (error) {
    return jsonRpcError(id, error);
  }
}

async function handleJsonRpcPayload(payload) {
  if (Array.isArray(payload)) {
    const responses = await Promise.all(payload.map(handleRequest));
    return responses.filter(Boolean);
  }

  return handleRequest(payload);
}

async function readRequestBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function writeJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': textEncoder.encode(body).length,
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'content-type, mcp-session-id',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
  });
  response.end(body);
}

function startHttpServer({ host, port }) {
  const server = createServer(async (request, response) => {
    try {
      if (request.method === 'OPTIONS') {
        response.writeHead(204, {
          'access-control-allow-origin': '*',
          'access-control-allow-headers': 'content-type, mcp-session-id',
          'access-control-allow-methods': 'GET, POST, OPTIONS',
        });
        response.end();
        return;
      }

      if (request.method === 'GET' && request.url === '/health') {
        writeJson(response, 200, { ok: true, server: 'integra-ng-mcp' });
        return;
      }

      if (request.method === 'GET' && request.url === '/components') {
        writeJson(response, 200, await listComponents({ includePrivate: true }));
        return;
      }

      if (request.method !== 'POST' || request.url !== '/mcp') {
        writeJson(response, 404, { error: 'Use POST /mcp for JSON-RPC MCP requests.' });
        return;
      }

      const body = await readRequestBody(request);
      const payload = JSON.parse(body);
      const result = await handleJsonRpcPayload(payload);
      if (result === undefined) {
        response.writeHead(202, { 'access-control-allow-origin': '*' });
        response.end();
        return;
      }
      writeJson(response, 200, result);
    } catch (error) {
      writeJson(response, 500, jsonRpcError(null, error));
    }
  });

  server.listen(port, host, () => {
    process.stderr.write(`integra-ng MCP server listening on http://${host}:${port}/mcp\n`);
  });

  return server;
}

function startStdioServer() {
  let buffer = '';

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', async (chunk) => {
    buffer += chunk;
    let boundary = buffer.indexOf('\n');

    while (boundary !== -1) {
      const line = buffer.slice(0, boundary).trim();
      buffer = buffer.slice(boundary + 1);

      if (line) {
        try {
          const response = await handleJsonRpcPayload(JSON.parse(line));
          if (response !== undefined) process.stdout.write(`${JSON.stringify(response)}\n`);
        } catch (error) {
          process.stdout.write(`${JSON.stringify(jsonRpcError(null, error))}\n`);
        }
      }

      boundary = buffer.indexOf('\n');
    }
  });
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  const args = parseArgs(process.argv.slice(2));
  if (args.mode === 'http') {
    startHttpServer(args);
  } else {
    startStdioServer();
  }
}
