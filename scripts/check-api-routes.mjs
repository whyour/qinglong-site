import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const upstream = process.argv[2];
if (!upstream) throw new Error('Usage: node scripts/check-api-routes.mjs /path/to/qinglong');
// Read source text only; never execute code from the upstream checkout.
const source = readFileSync(join(resolve(upstream), 'cli/src/remote/api/openOperations.ts'), 'utf8');
const declaration = source.split('export const openOperations:')[1];
if (!declaration) throw new Error('CLI registry format changed; review the route checker.');
const expected = new Map();
for (const [, block] of declaration.matchAll(/\{([^{}]+)\}/g)) {
  const value = (key) => block.match(new RegExp(`\\b${key}:\\s*'([^']+)'`))?.[1];
  const name = value('name'), method = value('method'), path = value('path');
  if (!name || !method || !path) throw new Error('Unrecognized CLI route entry; review the registry format.');
  const key = `${method} /open/${path}`;
  if (expected.has(key)) throw new Error(`Duplicate upstream route: ${key}`);
  expected.set(key, name);
}
if (!expected.size) throw new Error('No upstream routes found.');
const errors = [];
for (const lang of ['zh', 'en']) {
  const page = readFileSync(`docs/${lang}/api/routes.mdx`, 'utf8');
  const actual = new Map();
  for (const [, command, method, path] of page.matchAll(/\| `ql ([^`]+)` \| (GET|POST|PUT|DELETE) \| `([^`]+)`/g)) {
    const key = `${method} ${path}`;
    if (actual.has(key)) errors.push(`${lang}: duplicate ${key}`);
    actual.set(key, command.replace(/ <.*$/, ''));
  }
  for (const [key, name] of expected) {
    if (actual.get(key) !== name) errors.push(`${lang}: ${key} should document ql ${name}`);
  }
  for (const key of actual.keys()) {
    if (!expected.has(key)) errors.push(`${lang}: retired or unknown CLI route ${key}`);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Both languages match ${expected.size} registered CLI routes and command names.`);
}
