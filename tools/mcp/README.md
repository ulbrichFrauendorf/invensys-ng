# invensys-ng MCP Server

This sidecar serves source-backed usage guidance for the Angular components in `projects/invensys-ng`.
It scans the library source, public API exports, templates, projected slots, inputs, outputs, and UI-kit demo snippets at request time.

## Run With The UI App

```bash
npm run start:with-mcp
```

This starts:

- the Angular UI kit app through `npm run start`
- the MCP HTTP endpoint at `http://127.0.0.1:3200/mcp`

The port can be changed with `INVENSYS_NG_MCP_PORT`.

## Run Only The MCP Server

```bash
npm run mcp
```

By default the server reads the generated catalog at `dist/mcp/invensys-ng-catalog.json`.
If that file does not exist, it falls back to scanning the library and UI-kit source files.

Health and quick catalog checks:

```bash
curl http://127.0.0.1:3200/health
curl http://127.0.0.1:3200/components
```

## Generate The Production Catalog

```bash
npm run build:mcp-catalog
```

The root production build also runs this step:

```bash
npm run build
```

The generated artifact is:

```text
dist/mcp/invensys-ng-catalog.json
```

Deploy that JSON file alongside the Node MCP server. In production, this lets the MCP server serve component usage from a static catalog instead of requiring `projects/invensys-ng/src` and `projects/ui-kit/src/app/components` to be present.

To write or read the catalog from another location:

```bash
INVENSYS_NG_MCP_CATALOG_PATH=/app/catalog/invensys-ng-catalog.json npm run build:mcp-catalog
INVENSYS_NG_MCP_CATALOG_PATH=/app/catalog/invensys-ng-catalog.json npm run mcp
```

To force source scanning in local development:

```bash
INVENSYS_NG_MCP_CATALOG_MODE=source npm run mcp
```

## Stdio Mode

For MCP clients that launch servers by command:

```json
{
  "mcpServers": {
    "invensys-ng": {
      "command": "npm",
      "args": ["run", "mcp:stdio"]
    }
  }
}
```

## Agent Tools

- `list_components`: lists every exported selector-bearing component/directive by default.
- `search_components`: searches selectors, display names, exports, inputs, outputs, and demo examples.
- `get_component_usage`: returns import, selector, inputs, outputs, slots, source files, and examples for one component.
- `get_library_overview`: explains how an agent should use this MCP server.
- `get_theming_guide`: gives exact AI-agent instructions for theming the component library with the required `.light` / `.dark` CSS variable contract.

The server also exposes resources:

- `invensys-ng://catalog`
- `invensys-ng://overview`
- `invensys-ng://component/<component-id>`

## Example HTTP MCP Request

```bash
curl -X POST http://127.0.0.1:3200/mcp \
  -H "content-type: application/json" \
  -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"get_component_usage\",\"arguments\":{\"component\":\"i-button\"}}}"
```
