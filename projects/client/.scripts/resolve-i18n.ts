import { I18N_META_DIR } from './_internal/constants.ts';
import { writeJsonFile } from './_internal/writeJsonFile.ts';

const CONFLICT_RE =
  /<<<<<<< HEAD\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>> [^\n]+\n/g;

export function resolveJSONConflicts(input: string): Record<string, string> {
  let resolved = input;

  while (CONFLICT_RE.test(resolved)) {
    resolved = resolved.replace(CONFLICT_RE, (match, mine, theirs) => {
      let m = mine.trim();
      let t = theirs.trim();

      let openCount = 0;
      for (let i = 0; i < m.length; i++) {
        if (m[i] === '{') openCount++;
        else if (m[i] === '}') openCount--;
      }
      while (openCount > 0) {
        m += '\n  }';
        openCount--;
      }

      if (m.endsWith(',')) m = m.slice(0, -1);
      if (t.endsWith(',')) t = t.slice(0, -1);

      if (!m) return t ? t + ',\n' : '';
      if (!t) return m ? m + ',\n' : '';

      return m + ',\n' + t + ',\n';
    });
  }

  resolved = resolved.replace(/,\s*,/g, ',');
  resolved = resolved.replace(/,\s*}/g, '\n}');

  // In case any markers are leftover from broken nesting, completely remove them to allow parsing
  resolved = resolved.replace(/^<<<<<<<.*\n?/gm, '');
  resolved = resolved.replace(/^=======\n?/gm, ',\n');
  resolved = resolved.replace(/^>>>>>>>.*\n?/gm, '');
  resolved = resolved.replace(/,\s*,/g, ',');
  resolved = resolved.replace(/,\s*}/g, '\n}');

  let obj;
  let currentStr = resolved;
  let success = false;
  let parseError = null;

  for (let i = 0; i < 15; i++) {
    try {
      obj = JSON.parse(currentStr);
      success = true;
      break;
    } catch (e) {
      parseError = e;
      currentStr += '\n}';
    }
  }

  if (!success) {
    throw new Error(
      'Failed to parse resolved JSON: ' + parseError?.message + '\n\n' +
        resolved.substring(0, 500),
    );
  }

  return obj;
}

if (import.meta.main) {
  for (const dir of [I18N_META_DIR]) {
    for await (const dirEntry of Deno.readDir(dir)) {
      if (dirEntry.isFile) {
        const filePath = `${dir}/${dirEntry.name}`;
        try {
          const data = await Deno.readTextFile(filePath);
          const resolvedData = resolveJSONConflicts(data);
          await writeJsonFile(
            filePath,
            resolvedData,
          );
          console.log(`Conflicts resolved in file: ${dirEntry.name}`);
        } catch (err) {
          console.error(`Error processing file ${dirEntry.name}:`, err);
          // continue processing other files
        }
      }
    }
  }
}
