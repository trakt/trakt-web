import type { MovieLoreResponse } from '$lib/requests/models/MovieLoreResponse.ts';

const DUNE = {
  id: 287071,
  slug: 'dune-2021',
  title: 'Dune',
  year: 2021,
  poster:
    'media.trakt.tv/images/movies/000/287/071/posters/thumb/dune.jpg.webp',
};

export const MovieLoreVipResponseMock: MovieLoreResponse = {
  kind: 'series',
  setup: [
    '[Paul Atreides](https://app.trakt.tv/people/timothee-chalamet), an exiled monarch, has found refuge with the Fremen, the native people of the desert planet Arrakis.',
    "He is now with Chani and Stilgar's tribe, living among them and learning their ways.",
    'Paul seeks revenge against House Harkonnen, who conspired to destroy his family.',
    'He is also deeply troubled by intense visions of a terrible future that only he can foresee.',
  ],
  watchFirst: {
    verdict: 'required',
    note: 'This film is a direct continuation of the story from Dune (2021) and assumes prior knowledge of its characters and events.',
    movies: [DUNE],
  },
  earlier: [DUNE],
  attribution: 'https://en.wikipedia.org/wiki/Dune%3A_Part_Two',
  locked: null,
  lore: [
    "Arrakis is a harsh desert planet, the only source of 'spice', a valuable substance essential for interstellar travel and heightened awareness.",
    'The Fremen are the fierce, independent inhabitants of Arrakis, adapted to its harsh environment and living in hidden communities.',
    'The Bene Gesserit is a powerful sisterhood with advanced mental and physical abilities, who have subtly influenced human bloodlines for centuries.',
    "The Kwisatz Haderach is a prophesied messianic superbeing, a male Bene Gesserit with prescience capable of guiding humanity's future.",
    'House Atreides and House Harkonnen are rival Great Houses of the Imperium, locked in a bitter feud.',
    'The Padishah Emperor Shaddam IV rules the known universe, commanding the elite Sardaukar troops, who are among the most formidable fighters.',
  ],
  previously: [
    {
      movie: DUNE,
      summary:
        "[Duke Leto Atreides](https://app.trakt.tv/people/oscar-isaac) and his family, House Atreides, were assigned by the Emperor to govern Arrakis, replacing the brutal House Harkonnen. This was a trap, as the Emperor conspired with [Baron Vladimir Harkonnen](https://app.trakt.tv/people/stellan-skarsgard) to destroy House Atreides. After a betrayal, Duke Leto was killed, and his son [Paul Atreides](https://app.trakt.tv/people/timothee-chalamet) and concubine Lady Jessica, a Bene Gesserit, barely escaped into the deep desert. They encountered Stilgar's Fremen tribe and, after a ritual duel, Paul joined them, determined to fulfill his father's goal of bringing peace to Arrakis. Paul also experienced intense visions of a bloody holy war fought in his name.",
    },
  ],
};
