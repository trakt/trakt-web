import { getContext, setContext } from 'svelte';

const SCROLL_HISTORY_CONTEXT_KEY = Symbol('scroll-history');

const SCROLL_HISTORY_PREFIX = 'scroll-history-';
type EventType = 'restore' | 'snapshot';
type EventTypeData = {
  ['restore']: void;
  ['snapshot']: void;
};

type EventCallback<T extends EventType> = (data: EventTypeData[T]) => void;

class EventBus {
  private events: Map<EventType, Set<EventCallback<EventType>>> = new Map();

  on<T extends EventType>(event: T, callback: EventCallback<T>) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)?.add(callback as EventCallback<EventType>);

    return () => {
      this.events.get(event)?.delete(callback as EventCallback<EventType>);
    };
  }

  emit<T extends EventType>(event: T, data: EventTypeData[T]) {
    this.events.get(event)?.forEach((callback) => callback(data));
  }
}

type ScrollHistoryData = {
  writeScrollState: (id: string, value: number) => void;
  readScrollState: (id: string) => number;
  event: EventBus;
};

export function useScrollHistory() {
  const history = getContext<ScrollHistoryData>(SCROLL_HISTORY_CONTEXT_KEY) ??
    setContext(
      SCROLL_HISTORY_CONTEXT_KEY,
      getContext<ScrollHistoryData>(SCROLL_HISTORY_CONTEXT_KEY) ??
        {
          readScrollState: (id: string) => {
            return parseInt(
              sessionStorage.getItem(`${SCROLL_HISTORY_PREFIX}-${id}`) ?? '0',
            );
          },
          writeScrollState: (id: string, value: number) => {
            sessionStorage.setItem(
              `${SCROLL_HISTORY_PREFIX}-${id}`,
              value.toString(),
            );
          },
          event: new EventBus(),
        },
    );

  return history;
}
