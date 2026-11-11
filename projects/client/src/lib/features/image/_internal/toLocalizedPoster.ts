const posterPattern =
  /^(https:\/\/media\.trakt\.tv\/(movies|shows)\/(\d+)\/[a-z]+)\/poster\.webp$/;

type LocalizedPosterProps = {
  url: string | Nil;
  language: string | null;
};

export type LocalizedPoster = {
  src: string;
  type: string;
  id: string;
  language: string;
};

export function toLocalizedPoster({
  url,
  language,
}: LocalizedPosterProps): LocalizedPoster | null {
  if (!url || !language) return null;

  const [, base, type, id] = url.match(posterPattern) ?? [];
  if (!base || !type || !id) return null;

  return { src: `${base}/poster-${language}.webp`, type, id, language };
}
