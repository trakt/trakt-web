export function decodeMixtapeVector(encoded: string): Int8Array {
  return new Int8Array(
    Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0)).buffer,
  );
}
