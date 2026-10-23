import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Project, Node, SyntaxKind } from 'ts-morph';
import type { ComponentMeta, ComponentProp, ComponentExample } from '../src/mcp/types.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, '..');
const componentsDir = path.join(root, 'src/components');
const outFile = path.join(root, 'src/mcp/components-data.json');

const project = new Project({
  tsConfigFilePath: path.join(root, 'tsconfig.app.json'),
});

function getCategoryMap(): Map<string, string> {
  const indexText = fs.readFileSync(path.join(componentsDir, 'index.ts'), 'utf-8');
  const bannerRegex = /─{3,}\s*([A-Za-z ]+?)\s*─{3,}/;
  const exportRegex = /^export\s*\{\s*([^}]+)\s*\}\s*from\s*'\.\/(\w+)'/;

  const map = new Map<string, string>();
  let currentCategory = 'Uncategorized';

  for (const line of indexText.split('\n')) {
    const bannerMatch = line.match(bannerRegex);
    if (bannerMatch) {
      currentCategory = bannerMatch[1].trim();
      continue;
    }
    if (line.includes('export type')) continue;
    const exportMatch = line.match(exportRegex);
    if (!exportMatch) continue;
    for (const name of exportMatch[1].split(',').map((n) => n.trim())) {
      map.set(name, currentCategory);
    }
  }
  return map;
}

type FnLike = import('ts-morph').FunctionDeclaration | import('ts-morph').ArrowFunction | import('ts-morph').FunctionExpression;

interface ComponentCandidate {
  name: string;
  fn: FnLike;
  jsDocs: import('ts-morph').JSDoc[];
}

function getComponentCandidates(sourceFile: import('ts-morph').SourceFile): ComponentCandidate[] {
  const candidates: ComponentCandidate[] = [];

  for (const fn of sourceFile.getFunctions()) {
    const name = fn.getName();
    if (!fn.isExported() || !name || !/^[A-Z]/.test(name)) continue;
    candidates.push({ name, fn, jsDocs: fn.getJsDocs() });
  }

  for (const varDecl of sourceFile.getVariableDeclarations()) {
    const name = varDecl.getName();
    if (!/^[A-Z]/.test(name)) continue;
    const statement = varDecl.getVariableStatement();
    if (!statement?.isExported()) continue;
    const init = varDecl.getInitializer();
    if (init && (Node.isArrowFunction(init) || Node.isFunctionExpression(init))) {
      candidates.push({ name, fn: init, jsDocs: statement.getJsDocs() });
    }
  }

  return candidates;
}

function getDefaults(fn: FnLike): Map<string, string> {
  const defaults = new Map<string, string>();
  const param = fn.getParameters()[0];
  const nameNode = param?.getNameNode();
  if (nameNode && Node.isObjectBindingPattern(nameNode)) {
    for (const element of nameNode.getElements()) {
      const init = element.getInitializer();
      if (!init) continue;
      const propName = (element.getPropertyNameNode()?.getText() ?? element.getName()).replace(/^['"]|['"]$/g, '');
      defaults.set(propName, init.getText());
    }
  }
  return defaults;
}

function getAccessibilityNotes(fn: FnLike): string[] {
  const body = fn.getBody()?.getText() ?? '';
  const ariaAttrs = [...body.matchAll(/aria-[a-z-]+/g)].map((m) => m[0]);
  const roleAttrs = body.includes('role=') ? ['role'] : [];
  return [...new Set([...ariaAttrs, ...roleAttrs])];
}

function nodeToPlain(node: Node): unknown {
  if (Node.isStringLiteral(node)) return node.getLiteralText();
  if (Node.isNumericLiteral(node)) return Number(node.getText());
  if (node.getKind() === SyntaxKind.TrueKeyword) return true;
  if (node.getKind() === SyntaxKind.FalseKeyword) return false;
  if (Node.isObjectLiteralExpression(node)) return objectLiteralToPlain(node);
  return node.getText();
}

function objectLiteralToPlain(obj: import('ts-morph').ObjectLiteralExpression): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const prop of obj.getProperties()) {
    if (!Node.isPropertyAssignment(prop)) continue;
    const name = prop.getName().replace(/^['"]|['"]$/g, '');
    const valueNode = prop.getInitializer();
    if (valueNode) result[name] = nodeToPlain(valueNode);
  }
  return result;
}

function getExamples(folder: string, componentName: string): ComponentExample[] {
  // Prefer a stories file named after the component itself (several components
  // can share one source file, e.g. Heading/Text in Text.tsx, each with its
  // own stories file), falling back to the folder-named convention.
  const candidates = [
    path.join(componentsDir, folder, `${componentName}.stories.tsx`),
    path.join(componentsDir, folder, `${folder}.stories.tsx`),
  ];
  const storiesPath = candidates.find((p) => fs.existsSync(p));
  if (!storiesPath) return [];

  const sourceFile = project.addSourceFileAtPathIfExists(storiesPath) ?? project.addSourceFileAtPath(storiesPath);
  const examples: ComponentExample[] = [];

  for (const varDecl of sourceFile.getVariableDeclarations()) {
    if (varDecl.getName() === 'meta') continue;
    if (varDecl.getTypeNode()?.getText() !== 'Story') continue;

    const init = varDecl.getInitializer();
    if (!init || !Node.isObjectLiteralExpression(init)) continue;

    const argsProp = init.getProperty('args');
    let args: Record<string, unknown> = {};
    if (argsProp && Node.isPropertyAssignment(argsProp)) {
      const argsInit = argsProp.getInitializer();
      if (argsInit && Node.isObjectLiteralExpression(argsInit)) {
        args = objectLiteralToPlain(argsInit);
      }
    }
    examples.push({ name: varDecl.getName(), args });
  }
  return examples;
}

function generate(): ComponentMeta[] {
  const categoryMap = getCategoryMap();
  const allMeta: ComponentMeta[] = [];

  const folders = fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const folder of folders) {
    const tsxPath = path.join(componentsDir, folder, `${folder}.tsx`);
    if (!fs.existsSync(tsxPath)) continue;

    const sourceFile = project.addSourceFileAtPathIfExists(tsxPath) ?? project.addSourceFileAtPath(tsxPath);

    function unionLiterals(typeAlias: import('ts-morph').TypeAliasDeclaration | undefined): string[] {
      const typeNode = typeAlias?.getTypeNode();
      if (!typeNode || !Node.isUnionTypeNode(typeNode)) return [];
      return typeNode
        .getTypeNodes()
        .map((t) => t.getText().replace(/^'|'$/g, ''))
        .filter((t) => /^[a-zA-Z0-9_-]+$/.test(t));
    }

    const componentCandidates = getComponentCandidates(sourceFile);

    for (const { name: componentName, fn, jsDocs } of componentCandidates) {
      const description = jsDocs.length ? jsDocs[jsDocs.length - 1].getDescription().trim() : undefined;

      const param = fn.getParameters()[0];
      const propsTypeName = param?.getTypeNode()?.getText().split('<')[0].trim();
      const interfaceDecl =
        (propsTypeName && sourceFile.getInterface(propsTypeName)) ||
        sourceFile.getInterface(`${componentName}Props`);

      const variants = unionLiterals(sourceFile.getTypeAlias(`${componentName}Variant`));
      const sizes = unionLiterals(sourceFile.getTypeAlias(`${componentName}Size`));

      const defaults = getDefaults(fn);
      const props: ComponentProp[] = [];
      if (interfaceDecl) {
        for (const member of interfaceDecl.getProperties()) {
          const name = member.getName().replace(/^['"]|['"]$/g, '');
          const type = member.getTypeNode()?.getText() ?? member.getType().getText();
          const doc = member.getJsDocs()[0]?.getDescription().trim();
          props.push({
            name,
            type,
            required: !member.hasQuestionToken(),
            defaultValue: defaults.get(name),
            description: doc || undefined,
          });
        }
      }

      allMeta.push({
        name: componentName,
        category: categoryMap.get(componentName) ?? 'Uncategorized',
        description,
        importPath: '@pulseui/react',
        props,
        variants: [...new Set(variants)],
        sizes: [...new Set(sizes)],
        accessibility: getAccessibilityNotes(fn),
        examples: getExamples(folder, componentName),
      });
    }
  }

  allMeta.sort((a, b) => a.name.localeCompare(b.name));
  return allMeta;
}

const allMeta = generate();
// Normalize CRLF from Windows checkouts so the output matches CI (Linux) byte for byte.
const normalizeEol = (_key: string, value: unknown) => (typeof value === 'string' ? value.replace(/\r\n/g, '\n') : value);
fs.writeFileSync(outFile, JSON.stringify(allMeta, normalizeEol, 2) + '\n');
console.log(`Generated metadata for ${allMeta.length} components -> ${path.relative(root, outFile)}`);
