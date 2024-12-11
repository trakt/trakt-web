function resolveConflicts(data: string): Record<string, string> {
  const mineRegex = /<<<<<<< HEAD\n([\s\S]*?)=======/;
  const theirsRegex = /=======\n([\s\S]*?)>>>>>>> [^\n]+\n/;

  const mineMatch = data.match(mineRegex);
  const theirsMatch = data.match(theirsRegex);

  if (mineMatch && theirsMatch) {
    const mine = mineMatch[1]?.trim();
    const theirs = theirsMatch[1]?.trim();

    // Parse the conflicting sections as JSON objects
    const mineObj = JSON.parse(`{${mine}}`);
    const theirsObj = JSON.parse(`{${theirs}}`);

    // Extract the data before and after the conflict markers
    const [beforeConflict] = data.split(
      mineRegex,
    );

    // Remove trailing comma from beforeConflict if present
    const cleanedBeforeConflict = beforeConflict?.trim().replace(/,$/, '}');

    // Combine the parts into a single JSON string
    const combinedJson = JSON.parse(cleanedBeforeConflict ?? '{}');

    // Merge the objects, with "theirs" taking precedence over "mine"
    const resolvedObj = { ...mineObj, ...theirsObj };

    return { ...combinedJson, ...resolvedObj };
  }

  return JSON.parse(data);
}

const messagesDir = './i18n/messages';

for await (const dirEntry of Deno.readDir(messagesDir)) {
  if (dirEntry.isFile) {
    const filePath = `${messagesDir}/${dirEntry.name}`;
    try {
      const data = await Deno.readTextFile(filePath);
      const resolvedData = resolveConflicts(data);
      await Deno.writeTextFile(filePath, JSON.stringify(resolvedData, null, 2));
      console.log(`Conflicts resolved in file: ${dirEntry.name}`);
    } catch (err) {
      console.error(`Error processing file ${dirEntry.name}:`, err);
      break;
    }
  }
}
