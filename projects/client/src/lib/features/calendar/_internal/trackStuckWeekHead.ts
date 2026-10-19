import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';

type StuckWeekHeadParams = {
  onChange: (weekStart: string | null) => void;
};

function measureStuckHead(node: HTMLElement) {
  const limit =
    node.querySelector('.calendar-bar')?.getBoundingClientRect().bottom ?? 0;
  const heads = Array.from(
    node.querySelectorAll<HTMLElement>('[data-week-start]'),
    (head) => ({ head, rect: head.getBoundingClientRect() }),
  ).filter(({ rect }) => rect.height > 0);

  const stuckIndex = heads.filter(({ rect }) => rect.top < limit).length - 1;
  const stuck = heads.at(stuckIndex);
  const next = stuckIndex === -1 ? undefined : heads.at(stuckIndex + 1);

  const push = next
    ? Math.min(
        Math.max(limit + next.rect.height - next.rect.top, 0),
        next.rect.height,
      )
    : 0;

  return {
    weekStart:
      stuckIndex === -1 ? null : (stuck?.head.dataset.weekStart ?? null),
    height: stuck?.rect.height ?? 0,
    push,
  };
}

export function trackStuckWeekHead(
  node: HTMLElement,
  params: StuckWeekHeadParams,
) {
  let current = params;
  let frame = 0;
  let stuck: string | null | undefined;
  const written = new Map<string, string>();

  function writeVariable(name: string, value: number) {
    const next = `${value}px`;
    if (written.get(name) === next) return;

    written.set(name, next);
    node.style.setProperty(name, next);
  }

  function update() {
    frame = 0;
    const { weekStart, height, push } = measureStuckHead(node);
    writeVariable('--calendar-week-push', push);
    writeVariable('--calendar-week-head-height', height);

    if (weekStart === stuck) return;

    stuck = weekStart;
    current.onChange(weekStart);
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  schedule();

  const unregister = GlobalEventBus.getInstance().register('scroll', schedule);
  const resizeObserver = new ResizeObserver(schedule);
  resizeObserver.observe(node);

  return {
    update(next: StuckWeekHeadParams) {
      current = next;
      schedule();
    },
    destroy() {
      cancelAnimationFrame(frame);
      unregister();
      resizeObserver.disconnect();
    },
  };
}
