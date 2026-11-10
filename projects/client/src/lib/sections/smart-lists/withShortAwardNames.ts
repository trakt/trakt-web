import type { AwardCeremony } from '$lib/requests/models/AwardCeremony.ts';

const PREFIX_END = ' for ';

function toSharedPrefix(names: ReadonlyArray<string>): string {
  const [first = '', ...rest] = names;
  const length = rest.reduce((shared, name) => {
    const mismatch = [...name.slice(0, shared)].findIndex(
      (char, index) => char !== first.at(index),
    );
    return mismatch === -1 ? Math.min(shared, name.length) : mismatch;
  }, first.length);

  return first.slice(0, length);
}

export function withShortAwardNames(ceremony: AwardCeremony): AwardCeremony {
  if (ceremony.awards.length < 2) return ceremony;

  const shared = toSharedPrefix(ceremony.awards.map((award) => award.name));
  const end = shared.lastIndexOf(PREFIX_END);
  if (end === -1) return ceremony;

  const cut = end + PREFIX_END.length;

  return {
    ...ceremony,
    awards: ceremony.awards.map((award) => ({
      ...award,
      name: award.name.slice(cut),
    })),
  };
}
