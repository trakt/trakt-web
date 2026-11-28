type Detach = () => void;

type AttachAllParams = {
  selector: string;
  attach: (element: HTMLElement) => Detach | void;
};

type Rule = AttachAllParams & {
  attached: Map<HTMLElement, Detach | void>;
};

const rules = new Set<Rule>();
const watch: { observer: MutationObserver | null; frame: number } = {
  observer: null,
  frame: 0,
};

function sweep(rule: Rule) {
  document.body
    .querySelectorAll<HTMLElement>(rule.selector)
    .forEach((element) => {
      if (rule.attached.has(element)) return;
      rule.attached.set(element, rule.attach(element));
    });

  rule.attached.forEach((detach, element) => {
    if (element.isConnected) return;
    detach?.();
    rule.attached.delete(element);
  });
}

function schedule() {
  if (watch.frame !== 0) return;
  watch.frame = requestAnimationFrame(() => {
    watch.frame = 0;
    rules.forEach(sweep);
  });
}

function startWatching() {
  if (watch.observer) return;
  watch.observer = new MutationObserver(schedule);
  watch.observer.observe(document.body, { childList: true, subtree: true });
}

function stopWatching() {
  watch.observer?.disconnect();
  watch.observer = null;
  cancelAnimationFrame(watch.frame);
  watch.frame = 0;
}

export function attachAll({ selector, attach }: AttachAllParams): Detach {
  const rule: Rule = { selector, attach, attached: new Map() };

  rules.add(rule);
  sweep(rule);
  startWatching();

  return () => {
    rules.delete(rule);
    rule.attached.forEach((detach) => detach?.());
    rule.attached.clear();
    if (rules.size === 0) stopWatching();
  };
}
