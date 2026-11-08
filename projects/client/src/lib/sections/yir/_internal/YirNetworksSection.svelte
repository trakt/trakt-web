<script lang="ts">
  import type { YirCompany } from "$lib/requests/models/YirDetail";
  import { m } from "$lib/paraglide/messages";
  import YirCompaniesSection from "./YirCompaniesSection.svelte";

  const {
    networks,
  }: {
    networks: YirCompany[];
  } = $props();
</script>

<YirCompaniesSection
  id="section-shows-networks"
  sectionClass="trakt-yir-networks-section"
  bubblesClass="yir-network-bubbles"
  title={m.yir_section_title_networks()}
  type="shows"
  companies={networks}
/>
