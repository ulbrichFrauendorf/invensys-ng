#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';
import { writeStaticCatalog } from './integra-ng-mcp-server.mjs';

function parseOutputPath(argv) {
  const outputIndex = argv.findIndex((arg) => arg === '--output' || arg === '-o');
  if (outputIndex !== -1 && argv[outputIndex + 1]) {
    return argv[outputIndex + 1];
  }

  return process.env.INTEGRA_NG_MCP_CATALOG_PATH;
}

const outputPath = parseOutputPath(process.argv.slice(2));
const catalog = await writeStaticCatalog(outputPath);
const location = catalog.catalogPath || path.relative(process.cwd(), outputPath);

process.stdout.write(
  `Generated integra-ng MCP catalog with ${catalog.exportedComponentCount} exported components at ${location}\n`,
);
