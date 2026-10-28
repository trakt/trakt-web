import { render } from '@testing-library/svelte';
import type { Component } from 'svelte';
import ComponentTestBed from './ComponentTestBed.svelte';

type RenderComponentProps<T extends Record<string, unknown>> = {
  props: T;
  withFilters?: boolean;
};

export function renderComponent<T extends Record<string, unknown>>(
  component: Component<T>,
  { props, withFilters = false }: RenderComponentProps<T>,
) {
  return render(ComponentTestBed, {
    props: { component, props, withFilters },
  });
}
