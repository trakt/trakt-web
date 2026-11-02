const ROOT_PATH = 'images/share';

const VERSIONS = {
  mir: 1,
  profile: 1,
} as const;

type VersionedShareImagePrefix = {
  root: string;
  current: string;
};

export function versionedShareImagePrefix(
  kind: keyof typeof VERSIONS,
): VersionedShareImagePrefix {
  const root = `${ROOT_PATH}/${kind}/`;

  return { root, current: `${root}v${VERSIONS[kind]}/` };
}
