const CONFLICT_HEAD_REGEX = /<<<<<<< HEAD\n([\s\S]*?)=======/;
const INCOMING_CHANGE_REGEX = /=======\n([\s\S]*?)>>>>>>> [^\n]+\n/;
const END_CONFLICT_MARKER_REGEX = />>>>>>> [^\n]+\n([\s\S]*)/;

function cleanup(data: string | undefined): string {
  if (!data) {
    return '';
  }

  const trailingCommaRegex = /,$/;
  return data.trim()
    .replace(
      trailingCommaRegex,
      '',
    );
}

export function resolveJSONConflicts(input: string): Record<string, string> {
  const data = input.trim().replace(/^{|}$/g, '');

  const [, mineMatch] = data.match(CONFLICT_HEAD_REGEX) ?? [];
  const [, theirsMatch] = data.match(INCOMING_CHANGE_REGEX) ?? [];
  const [beforeConflict] = data.split(
    CONFLICT_HEAD_REGEX,
  );
  const [_, afterConflict] = data.split(
    END_CONFLICT_MARKER_REGEX,
  );

  if (mineMatch && theirsMatch) {
    const mine = cleanup(mineMatch);
    const theirs = cleanup(theirsMatch);
    const before = cleanup(beforeConflict);
    const after = cleanup(afterConflict);

    // Parse the conflicting sections as JSON objects
    const mineObj = JSON.parse(`{${mine}}`);
    const theirsObj = JSON.parse(`{${theirs}}`);
    const beforeObj = JSON.parse(`{${before}}`);
    const afterObj = JSON.parse(`{${after}}`);

    return { ...beforeObj, ...mineObj, ...theirsObj, ...afterObj };
  }

  return JSON.parse(input);
}

if (import.meta.main) {
  const messagesDir = './i18n/messages';

  for await (const dirEntry of Deno.readDir(messagesDir)) {
    if (dirEntry.isFile) {
      const filePath = `${messagesDir}/${dirEntry.name}`;
      try {
        const data = await Deno.readTextFile(filePath);
        const resolvedData = resolveJSONConflicts(data);
        await Deno.writeTextFile(
          filePath,
          JSON.stringify(resolvedData, null, 2) + '\n',
        );
        console.log(`Conflicts resolved in file: ${dirEntry.name}`);
      } catch (err) {
        console.error(`Error processing file ${dirEntry.name}:`, err);
        break;
      }
    }
  }
}
