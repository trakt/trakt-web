import type { PulseGraphData } from '../models/PulseGraphData.ts';
import type { PulseGraphType } from '../models/PulseGraphType.ts';

const minActiveDaysForDaily = 3;
const weekTrendVarianceThreshold = 0.25;
const clockPeakThreshold = 0.4;
const minRatingsForDistribution = 5;
const minDistinctScores = 3;

export const graphScoreMax = 10;

export function pickGraphs(
  graphData: PulseGraphData,
): ReadonlyArray<{ type: PulseGraphType; score: number }> {
  type Candidate = { type: PulseGraphType; score: number };
  const candidates: Candidate[] = [];

  const activeDays = graphData.dailyBars.days.filter((c) => c > 0).length;
  if (activeDays >= minActiveDaysForDaily) {
    candidates.push({ type: 'dailyBars', score: activeDays });
  }

  const weekPlays = graphData.weekTrend.weeks.map((w) => w.plays);
  const maxWeek = Math.max(...weekPlays);
  const minWeek = Math.min(...weekPlays);
  if (
    maxWeek > 0 && (maxWeek - minWeek) / maxWeek > weekTrendVarianceThreshold
  ) {
    candidates.push({
      type: 'weekTrend',
      score: ((maxWeek - minWeek) / maxWeek) * 10,
    });
  }

  const clockTotal = graphData.watchClock.buckets.reduce(
    (s, b) => s + b.count,
    0,
  );
  const clockPeak = Math.max(
    ...graphData.watchClock.buckets.map((b) => b.count),
  );
  if (clockTotal > 0 && clockPeak / clockTotal > clockPeakThreshold) {
    candidates.push({
      type: 'watchClock',
      score: (clockPeak / clockTotal) * 10,
    });
  }

  const { episodes, movies: movieCount } = graphData.showsMovies;
  if (episodes > 0 && movieCount > 0) {
    const balance = Math.min(episodes, movieCount) /
      Math.max(episodes, movieCount);
    candidates.push({ type: 'showsMovies', score: balance * 10 });
  }

  const ratingsBuckets = graphData.ratingsDistribution.buckets;
  const totalRatings = ratingsBuckets.reduce((s, c) => s + c, 0);
  const distinctScores = ratingsBuckets.filter((c) => c > 0).length;

  if (
    totalRatings >= minRatingsForDistribution &&
    distinctScores >= minDistinctScores
  ) {
    const nonZero = ratingsBuckets.filter((c) => c > 0);
    const mean = nonZero.reduce((s, c) => s + c, 0) / nonZero.length;
    const variance = nonZero.reduce((s, c) => s + (c - mean) ** 2, 0) /
      nonZero.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
    candidates.push({
      type: 'ratingsDistribution',
      score: Math.min(cv * 10, 10),
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates;
}
