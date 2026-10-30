type RejectionTarget = Pick<WindowEventHandlers, 'onunhandledrejection'>;

export function ignoreScriptedRejectionCalls(target: RejectionTarget): void {
  const handler = target.onunhandledrejection;
  if (!handler) return;

  target.onunhandledrejection = function (event: PromiseRejectionEvent) {
    if (!(event instanceof Event)) return true;

    return handler.call(this, event);
  };
}
