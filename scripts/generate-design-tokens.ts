/**
 * Parses src/tokens/*.css and emits a W3C Design Tokens (DTCG) JSON file,
 * so designers can import the same values Tokens Studio for Figma reads.
 *
 * Source of truth stays the CSS files — re-run this whenever a token changes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, '..');
const tokensDir = path.join(root, 'src/tokens');
const outFile = path.join(root, 'design-tokens.json');

const CATEGORY_TYPE: Record<string, string> = {
  color: 'color',
  space: 'dimension',
  radius: 'dimension',
  'border-width': 'dimension',
  'font-family': 'fontFamily',
  'font-size': 'dimension',
  'font-weight': 'fontWeight',
  'line-height': 'number',
};

const CATEGORY_GROUP: Record<string, string> = {
  color: 'color',
  space: 'spacing',
  radius: 'radius',
  'border-width': 'borderWidth',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'line-height': 'lineHeight',
};

const CATEGORIES = Object.keys(CATEGORY_TYPE).sort((a, b) => b.length - a.length);

interface RawToken {
  varName: string; // e.g. pulse-color-primary-dark
  category: string; // e.g. color
  leaf: string; // e.g. primary-dark
  rawValue: string;
}

function parseCssFile(file: string): RawToken[] {
  const text = fs.readFileSync(file, 'utf-8');
  const tokens: RawToken[] = [];
  const declRegex = /--(pulse-[\w-]+)\s*:\s*([^;]+);/g;
  let match: RegExpExecArray | null;
  while ((match = declRegex.exec(text))) {
    const varName = match[1];
    const rawValue = match[2].trim();
    const name = varName.replace(/^pulse-/, '');
    const category = CATEGORIES.find((c) => name === c || name.startsWith(`${c}-`));
    if (!category) {
      console.warn(`Skipping unrecognized token: --${varName}`);
      continue;
    }
    const leaf = name === category ? 'DEFAULT' : name.slice(category.length + 1);
    tokens.push({ varName, category, leaf, rawValue });
  }
  return tokens;
}

function resolveValue(rawValue: string, varToPath: Map<string, string>): string | number | string[] {
  const varRefMatch = rawValue.match(/^var\(--(pulse-[\w-]+)\)$/);
  if (varRefMatch) {
    const path = varToPath.get(varRefMatch[1]);
    if (path) return `{${path}}`;
  }
  return rawValue;
}

function toTypedValue(category: string, value: string | number | string[]) {
  const type = CATEGORY_TYPE[category];
  if (typeof value === 'string' && value.startsWith('{')) {
    return { $value: value, $type: type };
  }
  if (category === 'font-family' && typeof value === 'string') {
    const list = value.split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
    return { $value: list, $type: type };
  }
  if (category === 'font-weight' && typeof value === 'string') {
    return { $value: Number(value), $type: type };
  }
  if (category === 'line-height' && typeof value === 'string') {
    return { $value: Number(value), $type: type };
  }
  return { $value: value, $type: type };
}

function main() {
  const files = ['colors.css', 'spacing.css', 'typography.css'].map((f) => path.join(tokensDir, f));
  const rawTokens = files.flatMap(parseCssFile);

  const varToPath = new Map<string, string>();
  for (const t of rawTokens) {
    const group = CATEGORY_GROUP[t.category];
    const key = t.leaf === 'DEFAULT' ? group : `${group}.${t.leaf}`;
    varToPath.set(t.varName, key);
  }

  const result: Record<string, Record<string, unknown>> = {};
  for (const t of rawTokens) {
    const group = CATEGORY_GROUP[t.category];
    result[group] ??= {};
    const resolved = resolveValue(t.rawValue, varToPath);
    const typed = toTypedValue(t.category, resolved);
    result[group][t.leaf] = typed;
  }

  fs.writeFileSync(outFile, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`Wrote ${path.relative(root, outFile)} (${rawTokens.length} tokens)`);
}

main();
