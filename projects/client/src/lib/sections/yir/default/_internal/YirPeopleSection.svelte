<script lang="ts">
  import YirPeopleGroup from "./YirPeopleGroup.svelte";
  import YirPageInner from "./YirPageInner.svelte";
  import { m } from "$lib/paraglide/messages";

  const {
    slug,
    year,
  }: {
    slug: string;
    year: number;
  } = $props();
</script>

<section class="yir-people-section" id="section-people">
  <YirPageInner>
    <YirPeopleGroup {slug} {year} type="actors" label={m.yir_section_title_top_actors()} />
    <YirPeopleGroup {slug} {year} type="actresses" label={m.yir_section_title_top_actresses()} />
    <YirPeopleGroup {slug} {year} type="directors" label={m.yir_section_title_top_directors()} />
    <YirPeopleGroup {slug} {year} type="writers" label={m.yir_section_title_top_writers()} />
  </YirPageInner>
</section>

<style lang="scss">
  .yir-people-section {
    background-color: var(--shade-1000);
  }
</style>
