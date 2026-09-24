const HEX = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i;

export function hexToRgba(hex: string, alpha: number): string | undefined {
  const channels = HEX.exec(hex.trim())?.slice(1);

  if (!channels) {
    return;
  }

  const [r, g, b] = channels.map((channel) => parseInt(channel, 16));

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
