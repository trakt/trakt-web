import type { ExtendedMediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import type { CommentsProps } from '../CommentsProps.ts';

export function toCommentWatchProps(
  props: CommentsProps,
): ExtendedMediaStoreProps {
  const { media } = props;

  switch (props.type) {
    case 'episode':
      return {
        type: 'episode',
        media: { id: props.id, season: props.season, number: props.episode },
        show: { id: media.id, title: media.title },
      };
    case 'season':
      return {
        type: 'season',
        media: {
          id: props.id,
          number: props.season,
          episodes: { count: props.episodeCount, aired: props.episodeCount },
        },
        show: { id: media.id },
      };
    case 'movie':
      return { type: 'movie', media };
    case 'show':
      return { type: 'show', media };
  }
}
