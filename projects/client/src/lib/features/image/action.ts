import type { RequestEvent } from '@sveltejs/kit';
import { SerializedImageResponse } from './models/SerializedImageResponse.ts';

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
  const reader = new FileReader();

  const uri = await new Promise<string>((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(blob);
  });

  return { uri };
};
