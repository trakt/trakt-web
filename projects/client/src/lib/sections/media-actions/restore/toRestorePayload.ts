export function toRestorePayload(
  type: 'show',
  ids: number[],
) {
  const mappedIds = ids.map((id) => ({ ids: { trakt: id } }));

  switch (type) {
    case 'show':
      return {
        shows: mappedIds,
      };
  }
}
