import type { YirDetail } from '$lib/requests/models/YirDetail';
import type { Component } from 'svelte';
import Yir2024 from './2024/Yir2024.svelte';
import YirDefault from './default/YirDefault.svelte';

type YirTemplateProps = {
  /**
   * Null while the YIR detail query is in flight. Templates render their
   * scaffold (header / hero / etc) immediately and gate detail-dependent
   * sections so the page progressively fills in as data lands.
   */
  detail: YirDetail | null;
  /**
   * True while the underlying query is loading. Lets templates distinguish
   * "still fetching" from "loaded but empty" (e.g. a user with no plays).
   */
  isLoading: boolean;
  slug: string;
  year: number;
};

export type YirTemplate = Component<YirTemplateProps>;

export function getYirTemplate(year: number): YirTemplate {
  if (year === 2024) return Yir2024;
  return YirDefault;
}
