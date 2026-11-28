import type { TopicId } from './models/TopicId.ts';

type LoadCss = () => Promise<{ default: string }>;

const paintRegistry: Readonly<Record<TopicId, LoadCss>> = {
  'avengers-doomsday': () =>
    import('./_internal/avengers-doomsday/avengersDoomsday.css?inline'),
  'dune-3': () => import('./_internal/dune-3/duneThree.css?inline'),
  dunesday: () => import('./_internal/dunesday/dunesday.css?inline'),
};

export async function loadTopicPaint(topic: TopicId) {
  const [shared, own] = await Promise.all([
    import('./_internal/shared/topic.css?inline'),
    paintRegistry[topic](),
  ]);

  return `${shared.default}\n${own.default}`;
}
