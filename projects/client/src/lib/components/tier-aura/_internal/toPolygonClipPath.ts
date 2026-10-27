export function toPolygonClipPath(sides: number, rotation = 0): string {
  const points = Array.from({ length: sides }, (_, index) => {
    const angle = (index / sides) * Math.PI * 2 + rotation;
    const x = (50 + 50 * Math.cos(angle)).toFixed(2);
    const y = (50 + 50 * Math.sin(angle)).toFixed(2);
    return `${x}% ${y}%`;
  });

  return `polygon(${points.join(', ')})`;
}
