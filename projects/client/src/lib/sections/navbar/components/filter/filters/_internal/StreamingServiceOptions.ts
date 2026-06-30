export type StreamingServiceOption = {
  source: string;
  name: string;
  hasLogo: boolean;
};

export type StreamingBrandOption = {
  key: string;
  name: string;
  source: string;
  color: string | undefined;
  slugs: string[];
  hasLogo: boolean;
};

export type StreamingServiceOptions = {
  all: StreamingServiceOption[];
  top: StreamingBrandOption[];
  hasFavorites: boolean;
};
