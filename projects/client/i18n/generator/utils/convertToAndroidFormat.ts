/**
 * Convert message with variables metadata to Android format
 * Uses variables definition to determine the correct format specifiers
 */

export function convertToAndroidFormat(
  text: string,
  variables?: Record<string, { type: string }>,
): string {
  if (!variables) {
    // Simple fallback: treat all variables as strings
    return text.replace(/\{(\w+)\}/g, '%s');
  }

  let result = text;
  for (const [varName, varDef] of Object.entries(variables)) {
    const formatSpecifier = varDef.type === 'number' ? '%d' : '%s';
    result = result.replace(
      new RegExp(`\\{${varName}\\}`, 'g'),
      formatSpecifier,
    );
  }

  return result;
}
