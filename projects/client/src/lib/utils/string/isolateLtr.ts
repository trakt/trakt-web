const LRI = String.fromCharCode(0x2066); // Left-to-Right Isolate
const PDI = String.fromCharCode(0x2069); // Pop Directional Isolate

/** Wrap LTR text in bidi isolates so it renders correctly inside an RTL run. */
export const isolateLtr = (text: string): string => `${LRI}${text}${PDI}`;
