import type { RichTextMention } from '$lib/components/rich-text/RichTextMention.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { episodePeopleQuery } from '$lib/requests/queries/episode/episodePeopleQuery.ts';
import { moviePeopleQuery } from '$lib/requests/queries/movies/moviePeopleQuery.ts';
import { showPeopleQuery } from '$lib/requests/queries/shows/showPeopleQuery.ts';
import { map, type Observable } from 'rxjs';
import type { CommentTypeProps } from '../CommentsProps.ts';
import { toMediaMentions } from './toMediaMentions.ts';

export type MediaMentionSource = { slug: string } & CommentTypeProps;

const toPeopleQuery = (source: MediaMentionSource) => {
  if (source.type === 'movie') {
    return moviePeopleQuery({ slug: source.slug });
  }

  if (source.type === 'episode') {
    return episodePeopleQuery({
      slug: source.slug,
      season: source.season,
      episode: source.episode,
    });
  }

  return showPeopleQuery({ slug: source.slug });
};

export function useMediaMentions(source$: Observable<MediaMentionSource>) {
  const query = useQuery(source$.pipe(map(toPeopleQuery)));

  return {
    mentions: query.pipe(
      map(($query): ReadonlyArray<RichTextMention> =>
        $query.data ? toMediaMentions($query.data) : []
      ),
    ),
  };
}
