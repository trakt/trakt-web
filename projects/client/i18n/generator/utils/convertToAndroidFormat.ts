/**
 * Convert message with variables metadata to Android format
 * Uses variables definition to determine the correct format specifiers with positional arguments
 */

export function convertToAndroidFormat(
  text: string,
  variables?: Record<string, { type: string }>,
): string {
  // Find all variables in the text to determine their order
  const variableMatches = [...text.matchAll(/\{(\w+)\}/g)];

  if (variableMatches.length === 0) {
    return text;
  }

  let result = text;
  const usePositional = variableMatches.length > 1;
  let position = 1;

  // Process variables in the order they appear in the text
  for (const match of variableMatches) {
    const varName = match[1];
    if (!varName) continue;

    // TODO: extend with all formats
    // https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html
    const varType = variables?.[varName]?.type || 'string';
    const formatSpecifier = varType === 'number'
      ? (usePositional ? `%${position}$d` : '%d')
      : (usePositional ? `%${position}$s` : '%s');

    // Replace only the first occurrence to maintain correct positioning
    result = result.replace(`{${varName}}`, formatSpecifier);
    position++;
  }

  return result;
}
