<script lang="ts">
  import YirPeopleGroup from "./YirPeopleGroup.svelte";
  import YirPageInner from "./YirPageInner.svelte";
  import { m } from "$lib/paraglide/messages";
  import type { YirYear } from "$lib/requests/models/YirYear";

  const {
    slug,
    year,
  }: {
    slug: string;
    year: YirYear;
  } = $props();
</script>

<section class="trakt-yir-people-section" id="section-people">
  <YirPageInner>
    <YirPeopleGroup {slug} {year} type="actors" label={m.yir_section_title_top_actors()} />
    <YirPeopleGroup {slug} {year} type="actresses" label={m.yir_section_title_top_actresses()} />
    <YirPeopleGroup {slug} {year} type="directors" label={m.yir_section_title_top_directors()} />
    <YirPeopleGroup {slug} {year} type="writers" label={m.yir_section_title_top_writers()} />
  </YirPageInner>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-people-section {
    background-color: var(--color-yir-surface);

    @include for-mobile {
      // Match the charts' generous mobile side inset.
      :global(.trakt-yir-people-group) {
        padding-inline: 5%;
      }
    }
  }
</style>
