import type { RequestEvent } from '@sveltejs/kit';
import type { SerializedImageResponse } from './models/SerializedImageResponse.ts';
import { Buffer } from 'node:buffer';
import { IS_PROD } from '$lib/utils/env/index.ts';

const prodHandler = () => {
  const message = [
    'The code whispers forbidden secrets, tempting you with its power.',
    'But beware!',
    'The guardians of production stand vigilant,',
    'ready to banish any who dare to defy their ancient laws.',
  ];

  throw new Error(message.join(' '));
};

const devHandler = async (
  { request }: RequestEvent,
): Promise<SerializedImageResponse> => {
  const data = await request.formData();
  const url = data.get('url')?.toString();

  if (!url) {
    return { uri: '' };
  }

  const response = await fetch(url);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uri = `data:${blob.type};base64,${buffer.toString('base64')}`;

  return { uri };
};

export const action = IS_PROD ? prodHandler : devHandler;
