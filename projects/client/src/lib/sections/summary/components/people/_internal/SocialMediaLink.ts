export type SocialMediaLink =
  | { type: 'wikipedia'; id: string; language?: string | Nil }
  | {
      type: 'youtube' | 'instagram' | 'x' | 'tiktok' | 'facebook' | 'wikidata';
      id: string;
    };
