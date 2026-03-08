import type { CrewPosition } from '$lib/requests/models/CrewPosition.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import type { CrewMember } from '$lib/requests/models/MediaCrew.ts';
import { toTranslatedJob } from '$lib/utils/formatting/string/toTranslatedJob.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

type ToCrewMemberWithJobProps = {
  type: ExtendedMediaType;
  person: CrewMember;
  position: CrewPosition;
};

export function toCrewMemberWithJob(
  { type, person, position }: ToCrewMemberWithJobProps,
) {
  const jobs = person.jobs.map((job) => toTranslatedJob(job));
  const positions = {
    movies: type === 'movie' ? position : undefined,
    shows: type !== 'movie' ? position : undefined,
  };

  return {
    label: `${person.name} (${jobs.join(', ')})`,
    link: UrlBuilder.people(person.key, positions),
  };
}
