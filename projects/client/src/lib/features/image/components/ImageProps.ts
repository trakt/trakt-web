export type ImageProps = HTMLImageElementProps & {
  animate?: boolean;
  classList?: string;
  fallback?: string | Nil;
  onmissing?: () => void;
};
