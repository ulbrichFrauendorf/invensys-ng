#!/usr/bin/env node

import { spawn } from 'node:child_process';
import process from 'node:process';

const isWindows = process.platform === 'win32';
const npmCommand = 'npm';
const nodeCommand = process.execPath;
const mcpPort = process.env.INTEGRA_NG_MCP_PORT || '3200';
const mcpHost = process.env.INTEGRA_NG_MCP_HOST || '127.0.0.1';

const children = [];

let shuttingDown = false;

function prefixOutput(name, stream) {
  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    for (const line of chunk.split(/\r?\n/)) {
      if (line) process.stdout.write(`[${name}] ${line}\n`);
    }
  });
}

function spawnManaged(name, command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: options.shell || false,
  });

  children.push({ name, child });
  prefixOutput(name, child.stdout);
  prefixOutput(name, child.stderr);

  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    process.stderr.write(`[${name}] exited with ${signal || code}; stopping sidecar processes\n`);
    stopChildren();
    process.exit(code ?? 1);
  });
}

if (isWindows) {
  spawnManaged('ui-kit', 'cmd.exe', ['/d', '/s', '/c', 'npm run start -- --host 127.0.0.1']);
} else {
  spawnManaged('ui-kit', npmCommand, ['run', 'start', '--', '--host', '127.0.0.1']);
}

spawnManaged('mcp', nodeCommand, ['tools/mcp/integra-ng-mcp-server.mjs', '--http', '--host', mcpHost, '--port', mcpPort]);

function stopChildren() {
  for (const { child } of children) {
    if (!child.killed) child.kill(isWindows ? undefined : 'SIGTERM');
  }
}

process.on('SIGINT', () => {
  shuttingDown = true;
  stopChildren();
});

process.on('SIGTERM', () => {
  shuttingDown = true;
  stopChildren();
});

process.stdout.write(`Starting UI kit and integra-ng MCP sidecar at http://${mcpHost}:${mcpPort}/mcp\n`);
