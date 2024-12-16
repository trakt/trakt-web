export type MediaRating = {
  trakt: {
    rating: number;
    votes: number;
    distribution: {
      [key in 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10]: number;
    };
  };
  tmdb: {
    rating: number;
    votes: number;
  };
  rotten: {
    critic: number;
    audience: number;
  };
  imdb: {
    rating: number;
    votes: number;
  };
  metacritic: number;
};
