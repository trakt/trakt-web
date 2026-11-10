const AWARD_PREFIX = /^.*?\bAwards? for /;

export function toAwardCategoryName(category: string): string {
  const name = category.replace(AWARD_PREFIX, '');
  return name.length > 0 ? name : category;
}
