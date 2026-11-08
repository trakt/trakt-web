const OKLCH = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*\)$/i;

const toGamma = (channel: number) => {
  const clamped = Math.min(1, Math.max(0, channel));
  return clamped <= 0.0031308
    ? 12.92 * clamped
    : 1.055 * clamped ** (1 / 2.4) - 0.055;
};

const toHexChannel = (channel: number) =>
  Math.round(toGamma(channel) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();

export function oklchToHex(value: string): string | undefined {
  const match = OKLCH.exec(value.trim());
  if (!match) return;

  const [, rawLightness, percent, rawChroma, rawHue] = match;
  const lightness = Number(rawLightness) / (percent ? 100 : 1);
  const chroma = Number(rawChroma);
  const hue = (Number(rawHue) * Math.PI) / 180;

  const greenRed = chroma * Math.cos(hue);
  const blueYellow = chroma * Math.sin(hue);

  const long =
    (lightness + 0.3963377774 * greenRed + 0.2158037573 * blueYellow) ** 3;
  const medium =
    (lightness - 0.1055613458 * greenRed - 0.0638541728 * blueYellow) ** 3;
  const short =
    (lightness - 0.0894841775 * greenRed - 1.291485548 * blueYellow) ** 3;

  const red =
    4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short;
  const green =
    -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short;
  const blue =
    -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short;

  return `#${[red, green, blue].map(toHexChannel).join('')}`;
}
