import { describe, expect, it } from 'vitest';
import { isValidRedirectUri } from './isValidRedirectUri.ts';

describe('util: isValidRedirectUri', () => {
  it('should accept http(s) URIs with a path', () => {
    expect(isValidRedirectUri('https://example.com/callback')).toBe(true);
    expect(isValidRedirectUri('https://example.com')).toBe(true);
    expect(isValidRedirectUri('http://localhost:5173/auth/callback')).toBe(
      true,
    );
  });

  it('should accept the out-of-band redirect URI', () => {
    expect(isValidRedirectUri('urn:ietf:wg:oauth:2.0:oob')).toBe(true);
  });

  it('should accept custom schemes used by native clients', () => {
    expect(isValidRedirectUri('nuvio://auth')).toBe(true);
    expect(isValidRedirectUri('app.tivi://callback')).toBe(true);
  });

  it('should reject URIs with a query string or fragment', () => {
    expect(isValidRedirectUri('https://example.com/callback?state=1')).toBe(
      false,
    );
    expect(isValidRedirectUri('https://example.com/callback#token')).toBe(
      false,
    );
  });

  it('should reject schemes that can carry inline executable payloads', () => {
    // skipcq: JS-0087
    expect(isValidRedirectUri('javascript:alert(1)')).toBe(false);
    expect(isValidRedirectUri('data:text/html,<script></script>')).toBe(false);
    expect(isValidRedirectUri('vbscript:msgbox(1)')).toBe(false);
    expect(isValidRedirectUri('blob:https://example.com/uuid')).toBe(false);
    expect(isValidRedirectUri('view-source:javascript:alert(1)')).toBe(false);
    expect(isValidRedirectUri('filesystem:https://example.com/temporary/f'))
      .toBe(false);
  });

  it('should reject schemes without an authority', () => {
    expect(isValidRedirectUri('mailto:someone@example.com')).toBe(false);
    expect(isValidRedirectUri('nuvio:auth')).toBe(false);
  });

  it('should reject malformed values', () => {
    expect(isValidRedirectUri('example.com/callback')).toBe(false);
    expect(isValidRedirectUri('/callback')).toBe(false);
  });
});
