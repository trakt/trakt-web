import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { randomInt } from '$lib/utils/number/randomInt.ts';

const RANDOM_ABOUT_ME: string[] = [
  `This user is a mystery, shrouded in enigma...
  (or maybe just lazy? Who knows, this is the internet.)`,

  `Apparently, this user is too busy watching movies to write about themselves.
  (Fair enough, I can relate.)`,

  `This user's profile is a blank canvas, a void of information...
  (much like my social life. sigh)`,

  `Unravel the secrets of this user's identity...
  (if you dare)`,

  `What hidden depths lie beneath this empty profile?
  (The truth is out there...)`,

  `This user is a ghost in the machine, a digital phantom...
  (or maybe they just forgot to fill this out?)`,

  `Help this user out! Tell them to complete their profile.
  (They might even reward you with a virtual high five!)`,

  `This profile is begging for attention.
  Give it some love and tell the user to fill it out.`,

  `Don't be shy! Encourage this user to share their story.
  (Everyone has a story to tell, even if it's just about their favorite TV show.)`,

  `This user is like a character in a David Lynch film: enigmatic, mysterious,
  and possibly a figment of their own imagination.`,

  `This profile is as empty as a Blockbuster video store on a Friday night.
  (Remember those? Good times.)`,

  `This user is channeling their inner Tyler Durden: rejecting consumerism and embracing the void.
  (Or maybe they just haven't gotten around to filling this out yet.)`,

  `A stylized image: A funny illustration of a detective scratching their head in confusion,
  or a tumbleweed rolling across an empty profile page.`,

  `An interactive element: A button that allows users to send a friendly nudge to the profile owner,
  encouraging them to complete their profile.`,

  `A personalized message: If you have any information about the user (e.g., their watch history),
  you could use it to generate a more personalized placeholder, like "This user loves horror movies but hates writing bios.
  (Maybe they're too busy hiding from zombies?)"`,
] as const;

export function getRandomAbout(): string {
  const randomIndex = randomInt(0, RANDOM_ABOUT_ME.length);
  return assertDefined(RANDOM_ABOUT_ME.at(randomIndex));
}
