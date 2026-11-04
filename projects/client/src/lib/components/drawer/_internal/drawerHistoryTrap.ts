import { goto, pushState, replaceState } from '$app/navigation';
import { page } from '$app/state';

type TrapEntry = {
  id: string;
  onPop: () => void;
  onBrowserTransition?: () => void;
};

let entries: ReadonlyArray<TrapEntry> = [];
let latestUrl = new URL('about:blank');
let onJumpLanded: (() => void) | undefined;
let isRemovalQueued = false;
let ownNavigationHref: string | undefined;

const openIds = () => page.state.drawerTraps ?? [];
const isLive = (id: string) => entries.some((entry) => entry.id === id);
const isOnTop = (id: string) => openIds().at(-1) === id;

const markOwnNavigation = (url: URL) => {
  ownNavigationHref = url.href;
};

const isOwnNavigation = (url: URL) => {
  if (url.href !== ownNavigationHref) return false;

  ownNavigationHref = undefined;
  return true;
};

const keepLatestUrl = async () => {
  if (page.url.href === latestUrl.href) return;

  markOwnNavigation(latestUrl);
  // eslint-disable-next-line svelte/no-navigation-without-resolve
  await goto(latestUrl, {
    replaceState: true,
    noScroll: true,
    keepFocus: true,
    state: page.state,
  });
};

const jumpBack = (steps: number, onLanded: () => void) => {
  onJumpLanded = onLanded;
  globalThis.history.go(-steps);
};

const handlePop = (event: PopStateEvent) => {
  if (onJumpLanded) {
    const landed = onJumpLanded;
    onJumpLanded = undefined;
    landed();
    return;
  }

  const open = new Set(openIds());
  const popped = entries.filter((entry) => !open.has(entry.id));
  if (popped.length === 0) return;

  entries = entries.filter((entry) => open.has(entry.id));
  if (event.hasUAVisualTransition) {
    popped.forEach((entry) => entry.onBrowserTransition?.());
  }

  keepLatestUrl().then(() =>
    popped.toReversed().forEach((entry) => entry.onPop()),
  );
};

const push = (
  onPop: TrapEntry['onPop'],
  onBrowserTransition?: TrapEntry['onBrowserTransition'],
) => {
  globalThis.addEventListener('popstate', handlePop);

  latestUrl = new URL(page.url);
  const entry = { id: crypto.randomUUID(), onPop, onBrowserTransition };
  entries = [...entries, entry];
  pushState('', {
    ...page.state,
    drawerTraps: entries.map(({ id }) => id),
  });

  return entry.id;
};

const jumpOverRemoved = () => {
  isRemovalQueued = false;

  const ids = openIds();
  const removed = ids.length - (ids.findLastIndex(isLive) + 1);
  if (removed === 0) return;

  latestUrl = new URL(page.url);
  jumpBack(removed, keepLatestUrl);
};

const remove = (id: string) => {
  if (!isLive(id)) return;

  entries = entries.filter((entry) => entry.id !== id);
  if (isRemovalQueued) return;

  isRemovalQueued = true;
  queueMicrotask(jumpOverRemoved);
};

const restore = () => {
  latestUrl = new URL(page.url);
  const ids = entries.map(({ id }) => id);
  const open = new Set(openIds());
  if (ids.every((id) => open.has(id))) return;

  replaceState('', { ...page.state, drawerTraps: ids });
};

const activeEntry = () => {
  const top = entries.at(-1);
  return top && isOnTop(top.id) ? top : undefined;
};

const isActive = (id: string) => activeEntry()?.id === id;

const isTrapped = () => activeEntry() !== undefined;

const release = () =>
  new Promise<void>((resolve) => {
    entries = [];

    const steps = openIds().length;
    if (steps === 0) {
      resolve();
      return;
    }

    jumpBack(steps, resolve);
  });

export const drawerHistoryTrap = {
  push,
  remove,
  release,
  restore,
  markOwnNavigation,
  isOwnNavigation,
  isActive,
  isTrapped,
};
