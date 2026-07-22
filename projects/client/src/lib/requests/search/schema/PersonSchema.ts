export interface PersonSchema {
  id: string;
  name: string;
  top_billed_count: number;
  known_for_department?: string;
  slug?: string;
  headshot_url?: string;
}
