export async function copyToClipboard(text: string): Promise<void> {
  if (!navigator?.clipboard) {
    throw new Error('Clipboard API is not available');
  }

  await navigator.clipboard.writeText(text);
}
