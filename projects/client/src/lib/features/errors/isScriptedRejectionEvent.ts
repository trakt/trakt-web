export function isScriptedRejectionEvent(event: Event): boolean {
  return !event.isTrusted && event instanceof CustomEvent;
}
