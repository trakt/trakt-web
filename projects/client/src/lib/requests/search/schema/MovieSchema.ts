export interface MovieSchema {
  id: string;
  title: string;
  original_title?: string;
  aliases: string[];
  translations: string[];
  year?: number;
  trending_count: number;
  list_count: number;
  watcher_count: number;
  play_30_count: number;
  runtime?: number;
  slug?: string;
  poster_url?: string;
  genre_slugs?: string[];
  status?: string;
  released?: number;
}
