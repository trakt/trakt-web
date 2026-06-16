type CommonSocialActivityEntry = {
  key: string;
};

type ReviewSocialActivityEntry = CommonSocialActivityEntry & {
  type: 'review';
  author: string;
  reviewId: number;
};

type RatingSocialActivityEntry = CommonSocialActivityEntry & {
  type: 'rating';
  rating: number;
};

type WatchSocialActivityEntry = CommonSocialActivityEntry & {
  type: 'watch';
  playCount: number;
};

type WatchlistSocialActivityEntry = CommonSocialActivityEntry & {
  type: 'watchlist';
};

export type SocialActivityEntry =
  | ReviewSocialActivityEntry
  | RatingSocialActivityEntry
  | WatchSocialActivityEntry
  | WatchlistSocialActivityEntry;
