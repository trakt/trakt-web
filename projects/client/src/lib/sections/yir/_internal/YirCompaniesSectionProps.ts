import type { YirCompany } from '$lib/requests/models/YirDetail';

export type YirCompaniesSectionProps = {
  id: string;
  sectionClass: string;
  bubblesClass: string;
  title: string;
  type: 'shows' | 'movies';
  companies: YirCompany[];
};
