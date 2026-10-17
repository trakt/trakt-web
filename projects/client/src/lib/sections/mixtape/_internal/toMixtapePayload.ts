type Media = { id: number; type: 'movie' | 'show' };
type TraktId = { ids: { trakt: number } };

export function toMixtapePayload(media: ReadonlyArray<Media>) {
  const toIds = (type: Media['type']): TraktId[] =>
    media
      .filter((item) => item.type === type)
      .map(({ id }) => ({ ids: { trakt: id } }));

  return { movies: toIds('movie'), shows: toIds('show') };
}
