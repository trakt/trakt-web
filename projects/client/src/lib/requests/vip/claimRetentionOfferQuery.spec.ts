import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { claimRetentionOfferQuery } from './claimRetentionOfferQuery.ts';

describe('claimRetentionOfferQuery', () => {
  it('should report a claimed offer', async () => {
    server.use(
      http.post(
        'http://localhost/vip/stripe/retention-offer',
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    expect(await claimRetentionOfferQuery()).to.equal(true);
  });

  it('should report a refused offer', async () => {
    server.use(
      http.post(
        'http://localhost/vip/stripe/retention-offer',
        () => new HttpResponse(null, { status: 409 }),
      ),
    );

    expect(await claimRetentionOfferQuery()).to.equal(false);
  });
});
