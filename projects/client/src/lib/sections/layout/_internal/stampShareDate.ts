import { isTrendingShareImage } from './isTrendingShareImage.ts';

type StampShareDateProps = {
  url: URL;
  date: Date;
};

export function stampShareDate({ url, date }: StampShareDateProps): URL {
  if (!isTrendingShareImage(url)) return url;

  const stamped = new URL(url);
  stamped.searchParams.set('date', date.toISOString().slice(0, 10));

  return stamped;
}
