import { SignJWT } from 'jose';
import type { PageServerLoad } from './$types.ts';

export const load: PageServerLoad = async () => {
  const secretKey = 'USE_SECRET_HERE';

  console.log('Generating Featurebase token with secret key:', secretKey);

  try {
    // TODO actual user
    // TODO meta data
    const payload = {
      userId: 'seftur',
      name: 'Sefer Turan',
      email: 'seferturan85@gmail.com',
    };

    const secret = new TextEncoder().encode(secretKey);
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .sign(secret);

    return {
      featurebaseToken: token,
    };
  } catch (e) {
    // TODO proper error and handling
    console.error('Failed to generate Featurebase token', e);
    return {
      featurebaseToken: null,
    };
  }
};
