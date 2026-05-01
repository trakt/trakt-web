<script lang="ts">
  import type { YirCompany } from "$lib/requests/models/YirDetail";
  import { m } from "$lib/paraglide/messages";
  import YirNetworksChart from "./YirNetworksChart.svelte";
  import YirSectionHeader from "./YirSectionHeader.svelte";
  import YirPageInner from "./YirPageInner.svelte";

  const {
    studios,
  }: {
    studios: YirCompany[];
  } = $props();
</script>

<section class="yir-studios-section" id="section-movies-networks">
  <YirPageInner>
    <YirSectionHeader>
      {m.yir_section_title_studios()}
    </YirSectionHeader>

    <div class="yir-studio-bubbles">
      <YirNetworksChart companies={studios} type="movies" />
    </div>
  </YirPageInner>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-studios-section {
    background-color: var(--shade-950);
  }

  .yir-studio-bubbles {
    width: 100%;
    height: var(--ni-640);
    margin-top: var(--ni-neg-40);
    display: flex;
    align-items: center;
    justify-content: center;

    @include for-mobile {
      height: var(--ni-480);
    }
  }
</style>
