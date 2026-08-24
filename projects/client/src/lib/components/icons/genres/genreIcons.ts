import type { Genre } from '@trakt/api';

import actionSvg from './action.svg?raw';
import adventureSvg from './adventure.svg?raw';
import animationSvg from './animation.svg?raw';
import animeSvg from './anime.svg?raw';
import biographySvg from './biography.svg?raw';
import childrenSvg from './children.svg?raw';
import comedySvg from './comedy.svg?raw';
import crimeSvg from './crime.svg?raw';
import documentarySvg from './documentary.svg?raw';
import dramaSvg from './drama.svg?raw';
import familySvg from './family.svg?raw';
import fantasySvg from './fantasy.svg?raw';
import historySvg from './history.svg?raw';
import holidaySvg from './holiday.svg?raw';
import horrorSvg from './horror.svg?raw';
import musicalSvg from './musical.svg?raw';
import mysterySvg from './mystery.svg?raw';
import romanceSvg from './romance.svg?raw';
import scienceFictionSvg from './science-fiction.svg?raw';
import superheroSvg from './superhero.svg?raw';
import suspenseSvg from './suspense.svg?raw';
import thrillerSvg from './thriller.svg?raw';
import warSvg from './war.svg?raw';
import westernSvg from './western.svg?raw';

export const genreIcons: Record<Genre, string> = {
  action: actionSvg,
  adventure: adventureSvg,
  animation: animationSvg,
  anime: animeSvg,
  biography: biographySvg,
  children: childrenSvg,
  comedy: comedySvg,
  crime: crimeSvg,
  documentary: documentarySvg,
  drama: dramaSvg,
  family: familySvg,
  fantasy: fantasySvg,
  history: historySvg,
  holiday: holidaySvg,
  horror: horrorSvg,
  musical: musicalSvg,
  mystery: mysterySvg,
  romance: romanceSvg,
  'science-fiction': scienceFictionSvg,
  superhero: superheroSvg,
  suspense: suspenseSvg,
  thriller: thrillerSvg,
  war: warSvg,
  western: westernSvg,
};
