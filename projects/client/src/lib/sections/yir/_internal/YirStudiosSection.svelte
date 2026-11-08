<script lang="ts">
  import type { YirCompany } from "$lib/requests/models/YirDetail";
  import { m } from "$lib/paraglide/messages";
  import YirCompaniesSection from "./YirCompaniesSection.svelte";

  const {
    studios,
  }: {
    studios: YirCompany[];
  } = $props();
</script>

<YirCompaniesSection
  id="section-movies-networks"
  sectionClass="trakt-yir-studios-section"
  bubblesClass="yir-studio-bubbles"
  title={m.yir_section_title_studios()}
  type="movies"
  companies={studios}
/>
