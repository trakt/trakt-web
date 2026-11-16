import type { Review } from '$lib/sections/review/models/Review.ts';

export type YirFreeHeroProps = {
  watched: Review | null;
  name: string;
  avatarUrl: string;
  joinedAt: Date | Nil;
  year: number;
};
