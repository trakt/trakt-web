import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useNavbarState } from '../useNavbarState.ts';
import NavbarEntryStack from './NavbarEntryStack.svelte';

const STACK = '.trakt-navbar-entry-stack';

describe('NavbarEntryStack', () => {
  const { globalSet } = useNavbarState();

  beforeEach(() => {
    setAuthorization(true);
  });

  afterEach(() => {
    globalSet({ entry: null });
  });

  it('should stay empty while no page claims the entry slot', () => {
    renderComponent(NavbarEntryStack, { props: {}, withFilters: true });

    expect(document.querySelector(STACK)).toBeNull();
  });

  it('should hand the slot to the mixtape entry on discover', async () => {
    globalSet({ entry: 'mixtape' });

    renderComponent(NavbarEntryStack, { props: {}, withFilters: true });

    await screen.findByRole('link', { name: 'Make a mixtape' });
    expect(document.querySelector(STACK)).toHaveAttribute(
      'data-entry',
      'mixtape',
    );
  });

  it('should hand the slot to the mix it entry on the mixtape page', async () => {
    globalSet({ entry: 'mix' });

    renderComponent(NavbarEntryStack, { props: {}, withFilters: true });

    await screen.findByText('Mix it');
    expect(document.querySelector(STACK)).toHaveAttribute('data-entry', 'mix');
  });

  it('should keep every row mounted so the slot can roll between them', async () => {
    globalSet({ entry: 'today' });

    renderComponent(NavbarEntryStack, { props: {}, withFilters: true });

    await screen.findByRole('link', { name: "Open today's stories" });
    await screen.findByRole('link', { name: 'Make a mixtape' });
    await screen.findByText('Mix it');
    expect(document.querySelector(STACK)).toHaveAttribute(
      'data-entry',
      'today',
    );
  });
});
