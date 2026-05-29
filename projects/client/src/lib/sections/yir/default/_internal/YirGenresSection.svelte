<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { YirGenresGroup } from "$lib/requests/models/YirDetail.ts";
  import YirGenreBars from "../../_internal/YirGenreBars.svelte";
  import YirPageInner from "./YirPageInner.svelte";
  import YirSectionHeader from "./YirSectionHeader.svelte";

  type YirGenresSectionProps = {
    type: "shows" | "movies";
    genres: YirGenresGroup;
  };

  const { type, genres }: YirGenresSectionProps = $props();

  const sectionTitle = $derived(
    type === "shows"
      ? m.yir_section_title_show_genres()
      : m.yir_section_title_movie_genres(),
  );
</script>

<section class="yir-genres-section" id="section-{type}-genres">
  <YirPageInner>
    <YirSectionHeader>
      {sectionTitle}
    </YirSectionHeader>

    <YirGenreBars {type} {genres} />
  </YirPageInner>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-genres-section {
    background-color: var(--shade-1000);
    padding-bottom: var(--ni-72);

    @include for-mobile {
      padding-bottom: var(--ni-40);
    }
  }
</style>
