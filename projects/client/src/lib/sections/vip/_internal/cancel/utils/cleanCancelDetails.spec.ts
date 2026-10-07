import { describe, expect, it } from 'vitest';
import { cleanCancelDetails } from './cleanCancelDetails.ts';

describe('util: cleanCancelDetails', () => {
  it('should keep plain feedback as is', () => {
    expect(cleanCancelDetails('  Moving to another app  ')).toBe(
      'Moving to another app',
    );
  });

  it('should remove emails, handles, links and long numbers', () => {
    expect(
      cleanCancelDetails(
        'mail jane@example.com or @janedoe, order 1234567 at https://x.co/a',
      ),
    ).toBe('mail [removed] or [removed], order [removed] at [removed]');
  });

  it('should keep short numbers', () => {
    expect(cleanCancelDetails('I watch 3 shows a week')).toBe(
      'I watch 3 shows a week',
    );
  });

  it('should cap the result at 200 characters', () => {
    expect(cleanCancelDetails('a'.repeat(300))).toHaveLength(200);
  });
});
