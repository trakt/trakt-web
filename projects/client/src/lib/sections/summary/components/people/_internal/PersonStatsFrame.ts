/**
 * How the credit stats are framed.
 *
 * They are links, and until now carried nothing to say so - no frame, no fill, no
 * hover. That is the real problem worth solving; how loudly to solve it is the
 * open question:
 *
 * - `none`  no permanent frame - the fill appears on hover instead. Quietest, and
 *           matches a header that has had its outer border, its panel boxes and its
 *           scores plate stroke all deliberately removed. The default.
 * - `glass` a soft filled pill, the same surface language the anchored header uses
 *           for its own card. Reads as pressable without drawing a line.
 * - `ghost` an outlined pill. Loudest and least ambiguous, but it puts a stroke
 *           back over the artwork, which is what the rest of this header spent the
 *           day getting rid of.
 */
export type PersonStatsFrame = 'none' | 'glass' | 'ghost';

const FRAMES: ReadonlyArray<PersonStatsFrame> = ['none', 'glass', 'ghost'];

const DEFAULT_FRAME: PersonStatsFrame = 'none';

/** The search parameter that selects the framing, e.g. `?statframe=ghost`. */
export const PERSON_STATS_FRAME_PARAM = 'statframe';

export function toPersonStatsFrame(value: string | Nil): PersonStatsFrame {
  return FRAMES.find((frame) => frame === value) ?? DEFAULT_FRAME;
}
