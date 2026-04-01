<script lang="ts">
  import type { YirCompany } from "$lib/requests/models/YirDetail";
  import { m } from "$lib/paraglide/messages";
  import YirNetworksChart from "./YirNetworksChart.svelte";

  const {
    networks,
  }: {
    networks: YirCompany[];
  } = $props();
</script>

<section class="yir-networks-section" id="section-shows-networks">
  <div class="yir-page-inner">
    <div class="yir-section-header">
      <h2>
        <span class="yir-header-text">{m.yir_section_title_networks()}</span>
      </h2>
    </div>

    <div class="yir-network-bubbles">
      <YirNetworksChart companies={networks} type="shows" />
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;
  @use "./shared" as *;

  .yir-networks-section {
    background-color: var(--shade-950);
  }

  .yir-network-bubbles {
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
