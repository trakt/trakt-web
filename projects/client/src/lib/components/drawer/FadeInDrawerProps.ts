import type Drawer from '$lib/components/drawer/Drawer.svelte';
import type { ComponentProps } from 'svelte';

export type FadeInDrawerProps = Omit<ComponentProps<typeof Drawer>, 'onOpened'>;
