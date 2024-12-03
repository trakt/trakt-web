export type MediaRating = {
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
