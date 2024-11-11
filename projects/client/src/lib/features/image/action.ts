import type { RequestEvent } from '@sveltejs/kit';
import { SerializedImageResponse } from './models/SerializedImageResponse.ts';
import { Buffer } from 'node:buffer';

export const action = async (
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
