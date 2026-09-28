export type TodayMilestone = Readonly<{
  type: 'series-start' | 'season-start' | 'season-end' | 'series-end';
  season: number;
}>;
