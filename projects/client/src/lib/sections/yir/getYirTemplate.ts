import type { YirDetail } from '$lib/requests/models/YirDetail';
import type { Component } from 'svelte';
import Yir2024 from './2024/Yir2024.svelte';
import YirDefault from './default/YirDefault.svelte';

type YirTemplateProps = {
  detail: YirDetail;
  slug: string;
  year: number;
};

export type YirTemplate = Component<YirTemplateProps>;

export function getYirTemplate(year: number): YirTemplate {
  if (year === 2024) return Yir2024;
  return YirDefault;
}
