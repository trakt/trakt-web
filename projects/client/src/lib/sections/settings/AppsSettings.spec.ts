import * as m from '$lib/features/i18n/messages.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import AppsSettings from './AppsSettings.svelte';

import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('AppsSettings', () => {
  it('should display the official apps catalog first', () => {
    render(AppsSettings);

    const officialAppsTitle = screen.getByText(m.heading_official_apps());
    const applicationsTitle = screen.getByText(m.heading_apps_settings());

    expect(
      officialAppsTitle.compareDocumentPosition(applicationsTitle),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getByText('Showly')).toBeInTheDocument();
    const apiDocsLink = screen.getByRole('link', {
      name: new RegExp(m.heading_public_api_docs()),
    });

    expect(apiDocsLink).toHaveAttribute('href', UrlBuilder.docs.api());
    expect(apiDocsLink).toHaveAttribute('target', '_blank');
    expect(apiDocsLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
