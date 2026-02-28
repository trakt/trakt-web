/**
 * Escape XML special characters for Android string resources
 */

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\.{3}/g, '…')
    // Below replacements are specific to Android string resources to allow certain formatting tags to be preserved
    // Example: <string name="example"><![CDATA[This is <b><u>example</u></b>]]></string>
    .replace(/&lt;(\/?[bu])&gt;/g, '<$1>')
    .replace(/&lt;!/g, '<!')
    .replace(/]]&gt;/g, ']]>');
}
