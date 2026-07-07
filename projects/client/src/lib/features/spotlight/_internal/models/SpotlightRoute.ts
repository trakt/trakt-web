export type SpotlightRoute = {
  id: string;
  url: string;
  label: () => string;
  keywords: ReadonlyArray<string>;
};
