import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { addListCollaboratorRequest } from './addListCollaboratorRequest.ts';

const params = { listId: 1, userSlug: 'harry' };

describe('addListCollaboratorRequest', () => {
  it('should report added on a 204', async () => {
    server.use(
      http.post(
        'http://localhost/lists/1/collaborators/harry',
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    const result = await addListCollaboratorRequest(params);

    expect(result).toBe('added');
  });

  it('should report limit-reached on a 420', async () => {
    server.use(
      http.post(
        'http://localhost/lists/1/collaborators/harry',
        () =>
          HttpResponse.json({ error: 'Collaborator limit reached (10)' }, {
            status: 420,
          }),
      ),
    );

    const result = await addListCollaboratorRequest(params);

    expect(result).toBe('limit-reached');
  });

  it('should reject on an unexpected error response', async () => {
    server.use(
      http.post(
        'http://localhost/lists/1/collaborators/harry',
        () =>
          HttpResponse.json({ error: 'unable to add collaborator' }, {
            status: 403,
          }),
      ),
    );

    await expect(addListCollaboratorRequest(params)).rejects.toThrow();
  });
});
