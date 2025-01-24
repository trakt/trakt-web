export function checksum(input: string): string {
  const data = Array.from(new TextEncoder().encode(input));
  return data.reduce((hash, byte) => {
    return ((hash << 5n) - hash) + BigInt(byte);
  }, BigInt(0)).toString(32).slice(-32);
}
