<script lang="ts">
  import YirPeopleGroup from "./YirPeopleGroup.svelte";
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
  <div class="yir-people-container">
    <YirPeopleGroup {slug} {year} type="actors" label={m.yir_section_title_top_actors()} />
    <YirPeopleGroup {slug} {year} type="actresses" label={m.yir_section_title_top_actresses()} />
    <YirPeopleGroup {slug} {year} type="directors" label={m.yir_section_title_top_directors()} />
    <YirPeopleGroup {slug} {year} type="writers" label={m.yir_section_title_top_writers()} />
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-people-section {
    background-color: var(--shade-1000);
  }

  .yir-people-container {
    max-width: var(--ni-1280);
    margin: 0 auto;

    @include for-tablet-sm-and-below {
      max-width: var(--ni-920);
    }

    @include for-mobile {
      max-width: 100%;
    }
  }
</style>
