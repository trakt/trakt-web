const CONTAINER_WIDTH_UNIT = /(-?\d*\.?\d+)cqw\b/g;

type ResolveContainerUnitsProps = {
  html: string;
  width: number;
};

export function resolveContainerUnits({
  html,
  width,
}: ResolveContainerUnitsProps): string {
  return html.replace(
    CONTAINER_WIDTH_UNIT,
    (_, value: string) => `${(Number(value) * width) / 100}px`,
  );
}
