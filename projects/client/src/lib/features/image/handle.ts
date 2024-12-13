import { ImageEndpoint } from '$lib/features/image/ImageEndpoint.ts';
import { IS_PROD } from '$lib/utils/env/index.ts';
import type { Handle } from '@sveltejs/kit';
import { Buffer } from 'node:buffer';
import type { SerializedImageResponse } from './models/SerializedImageResponse.ts';

const prodResolver = () => {
  const message = [
    'The code whispers forbidden secrets, tempting you with its power.',
    'But beware!',
    'The guardians of production stand vigilant,',
    'ready to banish any who dare to defy their ancient laws.',
  ];

  throw new Error(message.join(' '));
};

const devResolver = async (
  source: string,
): Promise<SerializedImageResponse> => {
  if (!source) {
    return { uri: '' };
  }

  const response = await fetch(source);
  const blob = await response.blob();
  const isImage = blob.type.startsWith('image');
  if (!isImage) {
    console.error('Unexpected response for:', source);
    return { uri: '' };
  }

  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uri = `data:${blob.type};base64,${buffer.toString('base64')}`;

  return { uri };
};

export const resolver = IS_PROD ? prodResolver : devResolver;

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith(ImageEndpoint.Gimme)) {
    const { url } = await event.request.json() as { url: string };

    return new Response(JSON.stringify(await resolver(url)));
  }

  return resolve(event);
};
