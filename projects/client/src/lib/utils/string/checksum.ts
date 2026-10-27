const DIGITS = 32;
const BITS = DIGITS * 5;
const LIMIT = 1n << BigInt(BITS);

export function checksum(input: string): string {
  const { hash, hasOverflowed } = new TextEncoder().encode(input).reduce(
    (state, byte) => {
      const next = (state.hash << 5n) - state.hash + BigInt(byte);

      return {
        hash: BigInt.asUintN(BITS, next),
        hasOverflowed: state.hasOverflowed || next >= LIMIT,
      };
    },
    { hash: 0n, hasOverflowed: false },
  );

  const digits = hash.toString(32);

  return hasOverflowed ? digits.padStart(DIGITS, '0') : digits;
}
