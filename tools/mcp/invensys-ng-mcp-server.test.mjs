import assert from "node:assert/strict";
import { test } from "node:test";
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { buildCatalogFromSource } from "./invensys-ng-mcp-server.mjs";

test("catalog resolves inherited inputs and complete variation choices", async () => {
  const catalog = await buildCatalogFromSource();
  const checkbox = catalog.components.find((item) => item.selector === "i-checkbox");
  assert.deepEqual(checkbox.inputs.find((item) => item.binding === "size").values, ["small", "medium", "large"]);
  const dialog = catalog.components.find((item) => item.selector === "i-dialog");
  assert.ok(dialog.inputs.some((item) => item.binding === "width"));
  const button = catalog.components.find((item) => item.selector === "i-button");
  assert.ok(button.examples.length > 8);
  assert.ok(button.examples.some((example) => example.code.includes('severity="tertiary"')));
});

test("MCP usage filters and pages complete examples", async () => {
  const child = spawn(process.execPath, ["tools/mcp/invensys-ng-mcp-server.mjs", "--stdio"], { stdio: ["pipe", "pipe", "pipe"] });
  const lines = createInterface({ input: child.stdout });
  try {
    const response = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("MCP response timed out")), 20000);
      lines.once("line", (line) => { clearTimeout(timeout); resolve(JSON.parse(line)); });
    });
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "get_component_usage", arguments: { component: "i-button", format: "json", exampleLimit: 1, exampleQuery: "tertiary" } } }) + "\n");
    const result = await response;
    assert.equal(result.error, undefined);
    const usage = JSON.parse(result.result.content[0].text);
    assert.equal(usage.examples.length, 1);
    assert.ok(usage.exampleCount >= 1);
    assert.ok(usage.examples[0].code.includes("tertiary"));
  } finally {
    lines.close();
    child.kill();
  }
});
