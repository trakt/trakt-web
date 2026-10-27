type IsUpcomingProps = {
  effectiveReleaseDate: Date;
};

export function isUpcoming({ effectiveReleaseDate }: IsUpcomingProps): boolean {
  return effectiveReleaseDate.getTime() > Date.now();
}
