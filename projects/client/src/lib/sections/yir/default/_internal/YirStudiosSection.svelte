<script lang="ts">
  import type { YirCompany } from "$lib/requests/models/YirDetail";
  import { m } from "$lib/paraglide/messages";
  import YirNetworksChart from "./YirNetworksChart.svelte";

  const {
    studios,
  }: {
    studios: YirCompany[];
  } = $props();
</script>

<section class="yir-studios-section" id="section-movies-networks">
  <div class="yir-page-inner">
    <div class="yir-section-header">
      <h2>
        <span class="yir-header-text">{m.yir_section_title_studios()}</span>
      </h2>
    </div>

    <div class="yir-studio-bubbles">
      <YirNetworksChart companies={studios} type="movies" />
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;
  @use "./shared" as *;

  .yir-studios-section {
    background-color: var(--shade-950);
  }

  .yir-studio-bubbles {
    width: 100%;
    height: 600px;
    margin-top: -40px;
    display: flex;
    align-items: center;
    justify-content: center;

    @include for-mobile {
      height: 400px;
    }
  }
</style>
