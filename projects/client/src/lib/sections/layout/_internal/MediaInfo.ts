export type MediaInfo = {
  overview: string;
  runtime?: number;
  year?: number | Nil;
  genres?: ReadonlyArray<string>;
  rating?: number | Nil;
  votes?: number | Nil;
  certification?: string | Nil;
  updatedAt?: Date | Nil;
};
