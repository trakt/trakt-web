export function createRandom(seed: number) {
  const state = { value: seed >>> 0 };

  return () => {
    state.value = (state.value + 0x6d2b79f5) >>> 0;
    const mixed = Math.imul(
      state.value ^ (state.value >>> 15),
      state.value | 1,
    );
    const scrambled =
      mixed ^ (mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61));

    return ((scrambled ^ (scrambled >>> 14)) >>> 0) / 4294967296;
  };
}
