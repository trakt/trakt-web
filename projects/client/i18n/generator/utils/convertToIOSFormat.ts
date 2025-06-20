/**
 * Convert message with variables metadata to iOS format
 * Uses variables definition to determine the correct format specifiers
 */
export function convertToIOSFormat(
  text: string,
  variables?: Record<string, { type: string }>,
): string {
  if (!variables) {
    // Simple fallback: treat all variables as strings
    return text.replace(/\{(\w+)\}/g, '%@');
  }

  let result = text;
  for (const [varName, varDef] of Object.entries(variables)) {
    // TODO: extend with all formats
    // https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Strings/Articles/formatSpecifiers.html
    const formatSpecifier = varDef.type === 'number' ? '%d' : '%@';
    result = result.replace(
      new RegExp(`\\{${varName}\\}`, 'g'),
      formatSpecifier,
    );
  }

  return result;
}
