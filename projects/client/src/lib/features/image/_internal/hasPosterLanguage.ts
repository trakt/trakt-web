import z from 'zod';

const MEDIA_HOST = 'https://media.trakt.tv';

const ImageManifestSchema = z.object({
  poster: z.object({ langs: z.array(z.string()).nullish() }).nullish(),
});

type PosterLanguageProps = {
  type: string;
  id: string;
  language: string;
};

const manifests = new Map<string, Promise<ReadonlyArray<string>>>();

function fetchPosterLanguages(path: string): Promise<ReadonlyArray<string>> {
  return fetch(`${MEDIA_HOST}/${path}/images.json`)
    .then((response) => (response.ok ? response.json() : null))
    .then(
      (body) => ImageManifestSchema.safeParse(body).data?.poster?.langs ?? [],
    )
    .catch(() => []);
}

export function hasPosterLanguage({ type, id, language }: PosterLanguageProps) {
  const path = `${type}/${id}`;
  const languages = manifests.get(path) ?? fetchPosterLanguages(path);
  manifests.set(path, languages);

  return languages.then((langs) => langs.includes(language));
}
