type DevtoolsModule = typeof import('@tanstack/query-devtools');

type MountableDevtools = {
  mount: (element: HTMLElement) => void;
  unmount: () => void;
};

type MountQueryDevtoolsProps = {
  target: HTMLElement;
  create: (module: DevtoolsModule) => MountableDevtools;
};

export function mountQueryDevtools({
  target,
  create,
}: MountQueryDevtoolsProps): () => void {
  let devtools: MountableDevtools | undefined;
  let isCancelled = false;

  import('@tanstack/query-devtools').then((module) => {
    if (isCancelled) return;

    devtools = create(module);
    devtools.mount(target);
  });

  return () => {
    isCancelled = true;
    devtools?.unmount();
  };
}
