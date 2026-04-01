<script lang="ts">
  import type { YirCompany } from "$lib/requests/models/YirDetail";
  import { m } from "$lib/paraglide/messages";
  import YirNetworksChart from "./YirNetworksChart.svelte";
  import YirSectionHeader from "./YirSectionHeader.svelte";
  import YirPageInner from "./YirPageInner.svelte";

  const {
    networks,
  }: {
    networks: YirCompany[];
  } = $props();
</script>

<section class="yir-networks-section" id="section-shows-networks">
  <YirPageInner>
    <YirSectionHeader>
      {m.yir_section_title_networks()}
    </YirSectionHeader>

    <div class="yir-network-bubbles">
      <YirNetworksChart companies={networks} type="shows" />
    </div>
  </YirPageInner>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-networks-section {
    background-color: var(--shade-950);
  }

  .yir-network-bubbles {
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
