#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const catalogUrl = new URL('../dist/catalog.json', import.meta.url);
const schemaVersion = '0.1.0';
const capacityRank = { decorative: 0, sparse: 1, standard: 2, dense: 3 };
const commandOptions = {
  help: [],
  list: ['family', 'tag', 'ratio', 'capacity', 'format'],
  show: ['format'],
  css: ['shadow', 'format'],
  prompt: ['format'],
};
const commandFormats = {
  help: ['text'],
  list: ['table', 'ids', 'json'],
  show: ['text', 'json'],
  css: ['text', 'css', 'json'],
  prompt: ['text', 'json'],
};

function fail(command, code, message, { json = false, exitCode = 2 } = {}) {
  if (json) {
    console.error(JSON.stringify({
      ok: false,
      schemaVersion,
      command,
      error: { code, message },
    }));
  } else {
    console.error(`svhapes: ${message}`);
  }
  process.exit(exitCode);
}

function parseOptions(args, allowedOptions) {
  const options = { tags: [] };
  const positionals = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith('--')) {
      positionals.push(arg);
      continue;
    }

    const key = arg.slice(2);
    if (!allowedOptions.includes(key)) {
      throw new Error(`Unknown option: ${arg}`);
    }
    if (key === 'shadow') {
      options.shadow = true;
      continue;
    }

    const value = args[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`);
    index += 1;
    if (key === 'tag') options.tags.push(value);
    else options[key] = value;
  }

  return { options, positionals };
}

function jsonEnvelope(command, data) {
  return JSON.stringify({ ok: true, schemaVersion, command, data }, null, 2);
}

function standaloneWithShadow(shape) {
  return `${shape.snippets.standaloneCss}\n\n.svhape-shadow {\n  filter: drop-shadow(0 16px 24px rgb(15 18 15 / 0.16));\n}`;
}

let catalog;
try {
  catalog = JSON.parse(await readFile(fileURLToPath(catalogUrl), 'utf8'));
} catch (error) {
  fail('load', 'CATALOG_IO', error.message, { json: process.argv.includes('--format') && process.argv.includes('json'), exitCode: 5 });
}

const [command = 'help', ...rawArgs] = process.argv.slice(2);
const rawWantsJson = rawArgs.includes('json');
if (!(command in commandOptions)) {
  fail(command, 'INVALID_ARGUMENTS', `Unknown command: ${command}`, { json: rawWantsJson });
}

let parsed;
try {
  parsed = parseOptions(rawArgs, commandOptions[command]);
} catch (error) {
  fail(command, 'INVALID_ARGUMENTS', error.message, { json: rawWantsJson });
}

const { options, positionals } = parsed;
const format = options.format ?? (command === 'list' ? 'table' : 'text');
const wantsJson = format === 'json';
const expectedPositionals = ['show', 'css', 'prompt'].includes(command) ? 1 : 0;
if (positionals.length !== expectedPositionals) {
  const message = expectedPositionals === 1
    ? `${command} requires exactly one shape ID`
    : `${command} does not accept positional arguments`;
  fail(command, 'INVALID_ARGUMENTS', message, { json: wantsJson });
}
if (!commandFormats[command].includes(format)) {
  fail(command, 'INVALID_FORMAT', `Unsupported ${command} format: ${format}`, { json: wantsJson });
}

if (command === 'list') {
  let matches = [...catalog.shapes];
  if (options.family) matches = matches.filter((shape) => shape.family === options.family);
  for (const tag of options.tags) matches = matches.filter((shape) => shape.tags.includes(tag));
  if (options.ratio != null) {
    const ratio = Number(options.ratio);
    if (!Number.isFinite(ratio) || ratio <= 0) fail(command, 'INVALID_RATIO', '--ratio must be a positive number', { json: wantsJson });
    matches = matches.filter((shape) => ratio >= shape.selection.aspect.min && ratio <= shape.selection.aspect.max);
  }
  if (options.capacity) {
    if (!(options.capacity in capacityRank)) fail(command, 'INVALID_CAPACITY', `Unknown capacity: ${options.capacity}`, { json: wantsJson });
    matches = matches.filter((shape) => capacityRank[shape.selection.contentCapacity] >= capacityRank[options.capacity]);
  }
  if (matches.length === 0) fail(command, 'NO_MATCH', 'No shapes matched the supplied filters', { json: wantsJson, exitCode: 3 });

  if (format === 'ids') console.log(matches.map((shape) => shape.id).join('\n'));
  else if (wantsJson) console.log(jsonEnvelope(command, matches));
  else if (format === 'table') {
    const rows = matches.map((shape) => [shape.id, shape.family, shape.selection.contentCapacity, shape.name]);
    const widths = [0, 1, 2, 3].map((column) => Math.max(...rows.map((row) => row[column].length), ['ID', 'FAMILY', 'CAPACITY', 'NAME'][column].length));
    console.log(['ID', 'FAMILY', 'CAPACITY', 'NAME'].map((value, index) => value.padEnd(widths[index])).join('  '));
    console.log(rows.map((row) => row.map((value, index) => value.padEnd(widths[index])).join('  ')).join('\n'));
  }
} else if (['show', 'css', 'prompt'].includes(command)) {
  const id = positionals[0];
  const shape = catalog.shapes.find((candidate) => candidate.id === id);
  if (!shape) fail(command, 'UNKNOWN_SHAPE', `Unknown shape: ${id}`, { json: wantsJson, exitCode: 3 });

  if (command === 'show') {
    if (wantsJson) console.log(jsonEnvelope(command, shape));
    else console.log(`${shape.name} (${shape.id})\n${shape.description}\nFamily: ${shape.family}\nCapacity: ${shape.selection.contentCapacity}\nClasses: svhape ${shape.className}`);
  } else if (command === 'css') {
    const css = options.shadow ? standaloneWithShadow(shape) : shape.snippets.standaloneCss;
    if (wantsJson) console.log(jsonEnvelope(command, { id, css }));
    else console.log(css);
  } else if (wantsJson) console.log(jsonEnvelope(command, shape.agent));
  else console.log(shape.agent.prompt);
} else {
  console.log(`Svhapes ${catalog.packageVersion}\n\nCommands:\n  svhapes list [--family F] [--tag T] [--ratio N] [--capacity C] [--format table|ids|json]\n  svhapes show <id> [--format text|json]\n  svhapes css <id> [--shadow] [--format css|json]\n  svhapes prompt <id> [--format text|json]`);
}
