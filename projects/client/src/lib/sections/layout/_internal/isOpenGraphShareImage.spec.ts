import { describe, expect, it } from 'vitest';
import { isOpenGraphShareImage } from './isOpenGraphShareImage.ts';

const toUrl = (path: string) => new URL(path, 'https://app.trakt.tv');

describe('util: isOpenGraphShareImage', () => {
  it('should match the trending share image', () => {
    expect(
      isOpenGraphShareImage(toUrl('/api/shareable-image/trending?type=show')),
    ).toBe(true);
  });

  it('should match a profile share image', () => {
    expect(
      isOpenGraphShareImage(toUrl('/api/shareable-image/profile/sean')),
    ).toBe(true);
  });

  it('should match a month in review link preview image', () => {
    expect(
      isOpenGraphShareImage(
        toUrl('/users/sean/mir.jpg?year=2026&month=10&shape=og'),
      ),
    ).toBe(true);
  });

  it('should not match the square or story month in review images', () => {
    expect(
      isOpenGraphShareImage(
        toUrl('/users/sean/mir.jpg?year=2026&month=10&shape=story'),
      ),
    ).toBe(false);
  });

  it('should not match other images', () => {
    expect(isOpenGraphShareImage(toUrl('/assets/cover.jpg'))).toBe(false);
  });
});
