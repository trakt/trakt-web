import { assertDefined } from '../assert/assertDefined.ts';

type EventHandler<T extends Event> = (event: T) => void;

class GlobalEventBus {
  private static instance: GlobalEventBus;
  private handlers: Map<string, Set<EventHandler<Event>>> = new Map();
  private dispatchers: Map<string, EventHandler<Event>> = new Map();

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static getInstance(): GlobalEventBus {
    if (!GlobalEventBus.instance) {
      GlobalEventBus.instance = new GlobalEventBus();
    }
    return GlobalEventBus.instance;
  }

  public register<Type extends keyof WindowEventMap>(
    eventType: Type,
    handler: EventHandler<WindowEventMap[Type]>,
  ): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());

      const dispatcher = this._dispatch.bind(this);
      this.dispatchers.set(eventType, dispatcher);
      globalThis.addEventListener(eventType, dispatcher);
    }

    const ref = assertDefined(
      this.handlers.get(eventType),
      'Handler should be defined',
    );

    ref.add(handler as EventHandler<Event>);

    return () => this._unregister(eventType, handler);
  }

  private _dispatch(event: Event): void {
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      handlers.forEach((handler) => handler(event));
    }
  }

  private _unregister<Type extends keyof WindowEventMap>(
    eventType: Type,
    handler: EventHandler<WindowEventMap[Type]>,
  ): void {
    if (this.handlers.has(eventType)) {
      const handlers = assertDefined(
        this.handlers.get(eventType),
        'Handler should be defined',
      );
      handlers.delete(handler as EventHandler<Event>);

      if (handlers.size === 0) {
        this.handlers.delete(eventType);

        const dispatcher = this.dispatchers.get(eventType);
        if (dispatcher) {
          globalThis.removeEventListener(eventType, dispatcher);
          this.dispatchers.delete(eventType);
        }
      }
    }
  }
}

export { GlobalEventBus };
