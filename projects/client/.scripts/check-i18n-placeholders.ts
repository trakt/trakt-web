import { I18N_MESSAGES_DIR, I18N_META_DIR } from './_internal/constants.ts';

const IDENTIFIER_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
const ICU_KEYWORDS = new Set([
  'plural',
  'select',
  'selectordinal',
  'number',
  'date',
  'time',
]);

const RECURSIVE_ICU_KEYWORDS = new Set(['plural', 'select', 'selectordinal']);

function scanForPlaceholders(text: string, names: Set<string>): void {
  let depth = 0;
  let start = -1;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '{') {
      if (depth === 0) start = i + 1;
      depth++;
      continue;
    }

    if (ch !== '}' || depth === 0) continue;

    depth--;
    if (depth !== 0) continue;

    const inner = text.slice(start, i);
    const commaIndex = inner.indexOf(',');

    if (commaIndex === -1) {
      const candidate = inner.trim();
      if (IDENTIFIER_RE.test(candidate)) names.add(candidate);
      continue;
    }

    const name = inner.slice(0, commaIndex).trim();
    const remaining = inner.slice(commaIndex + 1);
    const keyword = remaining.trim().split(/[,\s]/)[0] ?? '';

    if (!IDENTIFIER_RE.test(name) || !ICU_KEYWORDS.has(keyword)) continue;
    names.add(name);

    if (RECURSIVE_ICU_KEYWORDS.has(keyword)) {
      scanFormContents(remaining, names);
    }
  }
}

function scanFormContents(text: string, names: Set<string>): void {
  let depth = 0;
  let start = -1;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '{') {
      if (depth === 0) start = i + 1;
      depth++;
      continue;
    }

    if (ch !== '}' || depth === 0) continue;

    depth--;
    if (depth !== 0) continue;

    scanForPlaceholders(text.slice(start, i), names);
  }
}

export function extractPlaceholders(text: string): ReadonlySet<string> {
  const names = new Set<string>();
  scanForPlaceholders(text, names);
  return names;
}

type Mismatch = {
  locale: string;
  key: string;
  reason: string;
  source: string;
  target: string;
};

export function findMismatches(
  source: Readonly<Record<string, string>>,
  target: Readonly<Record<string, string>>,
  locale: string,
): ReadonlyArray<Mismatch> {
  const mismatches: Array<Mismatch> = [];

  for (const [key, translation] of Object.entries(target)) {
    const sourceText = source[key];
    if (typeof sourceText !== 'string' || typeof translation !== 'string') {
      continue;
    }

    const sourceNames = extractPlaceholders(sourceText);
    const targetNames = extractPlaceholders(translation);
    const extra = [...targetNames].filter((n) => !sourceNames.has(n));
    const missing = [...sourceNames].filter((n) => !targetNames.has(n));

    if (extra.length === 0 && missing.length === 0) continue;

    const parts: Array<string> = [];
    if (extra.length > 0) parts.push(`extra in target: ${extra.join(', ')}`);
    if (missing.length > 0) {
      parts.push(`missing in target: ${missing.join(', ')}`);
    }

    mismatches.push({
      locale,
      key,
      reason: parts.join('; '),
      source: sourceText,
      target: translation,
    });
  }

  return mismatches;
}

async function readSource(): Promise<Record<string, string>> {
  const raw = await Deno.readTextFile(`${I18N_META_DIR}/en.json`);
  const parsed = JSON.parse(raw) as {
    messages: Record<string, { default: string }>;
  };
  return Object.fromEntries(
    Object.entries(parsed.messages).map(([k, v]) => [k, v.default]),
  );
}

async function readLocale(file: string): Promise<Record<string, string>> {
  const raw = await Deno.readTextFile(`${I18N_MESSAGES_DIR}/${file}`);
  return JSON.parse(raw) as Record<string, string>;
}

if (import.meta.main) {
  const source = await readSource();
  const all: Array<Mismatch> = [];

  for await (const entry of Deno.readDir(I18N_MESSAGES_DIR)) {
    if (!entry.isFile || !entry.name.endsWith('.json')) continue;

    const target = await readLocale(entry.name);
    const locale = entry.name.replace(/\.json$/, '');
    all.push(...findMismatches(source, target, locale));
  }

  if (all.length === 0) {
    console.log('All i18n placeholders consistent with source.');
    Deno.exit(0);
  }

  console.error(`Found ${all.length} placeholder mismatch(es):\n`);
  for (const m of all) {
    console.error(`  ${m.locale} :: ${m.key}`);
    console.error(`    reason: ${m.reason}`);
    console.error(`    source: ${m.source}`);
    console.error(`    target: ${m.target}\n`);
  }
  Deno.exit(1);
}
