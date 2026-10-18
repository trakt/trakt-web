import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { convertToSmartListRequest } from './convertToSmartListRequest.ts';

const CONVERT_URL =
  'http://localhost/users/me/lists/silos/smart-list-draft/convert';
const BODY = {
  name: 'Silos',
  source: 'trending' as const,
  media_type: 'shows' as const,
  filters: { genres: ['drama'] },
};
const IDS = { trakt: 99999, slug: 'silos-smart' };

describe('convertToSmartListRequest', () => {
  it('should return the new smart list slug on 201', async () => {
    server.use(
      http.post(CONVERT_URL, () =>
        HttpResponse.json({ ids: IDS }, { status: 201 }),
      ),
    );

    expect(
      await convertToSmartListRequest({ listId: 'silos', body: BODY }),
    ).to.equal('silos-smart');
  });

  it('should return the existing smart list slug on 200', async () => {
    server.use(
      http.post(CONVERT_URL, () =>
        HttpResponse.json({ ids: IDS }, { status: 200 }),
      ),
    );

    expect(
      await convertToSmartListRequest({ listId: 'silos', body: BODY }),
    ).to.equal('silos-smart');
  });

  it('should send the body as given', async () => {
    let requestBody: unknown;
    server.use(
      http.post(CONVERT_URL, async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json({ ids: IDS }, { status: 201 });
      }),
    );

    await convertToSmartListRequest({ listId: 'silos', body: BODY });

    expect(requestBody).to.deep.equal(BODY);
  });

  it('should return null when the list is not convertible', async () => {
    server.use(
      http.post(CONVERT_URL, () =>
        HttpResponse.json({ error: 'list_not_convertible' }, { status: 404 }),
      ),
    );

    expect(
      await convertToSmartListRequest({ listId: 'silos', body: BODY }),
    ).to.equal(null);
  });
});
