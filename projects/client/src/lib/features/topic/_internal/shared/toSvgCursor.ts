type ToSvgCursorParams = {
  svg: string;
  hotspot: number;
};

export function toSvgCursor({ svg, hotspot }: ToSvgCursorParams) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hotspot} ${hotspot}`;
}
