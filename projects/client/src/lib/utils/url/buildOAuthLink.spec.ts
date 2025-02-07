import { describe, expect, it } from 'vitest';
import { buildOAuthUrl } from './buildOAuthLink.ts';

describe('buildOAuthUrl', () => {
  it('should build proper oauth url with https', () => {
    const result = buildOAuthUrl('test-client-id', 'http://localhost:5173');

    expect(result).toBe(
      'https://trakt.tv/oauth/authorize?client_id=test-client-id&redirect_uri=http://localhost:5173&response_type=code&hide_email_form=true',
    );
  });

  it('should build proper oauth url when origin already has https', () => {
    const result = buildOAuthUrl('test-client-id', 'https://my-app.com');

    expect(result).toBe(
      'https://trakt.tv/oauth/authorize?client_id=test-client-id&redirect_uri=https://my-app.com&response_type=code&hide_email_form=true',
    );
  });
});
