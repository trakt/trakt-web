import { BehaviorSubject } from 'rxjs';
import type { DevtoolsTool } from './_internal/DevtoolsTool.ts';

type DevtoolsState = {
  isDrawerOpen: boolean;
  activeTool: DevtoolsTool | Nil;
};

function createDevtoolsStore() {
  const subject = new BehaviorSubject<DevtoolsState>({
    isDrawerOpen: false,
    activeTool: null,
  });

  const update = (state: Partial<DevtoolsState>) =>
    subject.next({ ...subject.value, ...state });

  return {
    subscribe: subject.subscribe.bind(subject),
    openDrawer: () => update({ isDrawerOpen: true }),
    closeDrawer: () => update({ isDrawerOpen: false }),
    openTool: (tool: DevtoolsTool) =>
      update({ isDrawerOpen: false, activeTool: tool }),
    closeTool: () => update({ activeTool: null }),
  };
}

export const devtoolsStore = createDevtoolsStore();
