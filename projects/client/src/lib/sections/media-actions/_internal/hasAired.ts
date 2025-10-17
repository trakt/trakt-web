import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';

type AirDateProps = {
  airDate: Date;
  type: 'episode' | 'show';
};

type StatusProps = {
  status: MediaStatus;
  type: 'movie';
};

type HasAiredProps = AirDateProps | StatusProps;

export function hasAired(props: HasAiredProps): boolean {
  if ('status' in props) {
    return props.status === 'released';
  }

  return props.airDate <= new Date();
}
