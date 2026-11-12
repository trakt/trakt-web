import { DocumentaryCheckPublicMappedMock } from '$mocks/data/summary/documentary-check/mapped/DocumentaryCheckPublicMappedMock.ts';
import { RealityCheckPublicMappedMock } from '$mocks/data/summary/reality-check/mapped/RealityCheckPublicMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import RealityCheckPill from './RealityCheckPill.svelte';

describe('RealityCheckPill', () => {
  it('should draw the documentary pill for a documentary check', async () => {
    const { container } = renderComponent(RealityCheckPill, {
      props: { realityCheck: DocumentaryCheckPublicMappedMock },
    });

    expect(await screen.findByText('Widely disputed')).toBeVisible();
    expect(container.querySelector('.trakt-reality-tier-pill')).toBeNull();
  });

  it('should draw the meter pill for a story check', async () => {
    const { container } = renderComponent(RealityCheckPill, {
      props: { realityCheck: RealityCheckPublicMappedMock },
    });

    expect(await screen.findByText('Loosely based')).toBeVisible();
    expect(container.querySelector('.trakt-documentary-tier-pill')).toBeNull();
  });
});
