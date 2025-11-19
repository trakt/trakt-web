export function toCountryFlag(countryCode: string) {
  const code = countryCode.toUpperCase();

  return code.replace(
    /./g,
    (c) => String.fromCodePoint(0x1f1e6 + (c.charCodeAt(0) - 65)),
  );
}
