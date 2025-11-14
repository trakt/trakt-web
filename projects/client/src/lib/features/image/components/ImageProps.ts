type Default = {
  type: 'default';
};

type Masked = {
  type: 'masked';
  color: string;
};

export type ImageProps = HTMLImageElementProps & {
  animate?: boolean;
  classList?: string;
  variant?: Default | Masked;
};
