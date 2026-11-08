<script lang="ts">
  import YirNetworksChart from "./YirNetworksChart.svelte";
  import YirSectionHeader from "./YirSectionHeader.svelte";
  import YirPageInner from "./YirPageInner.svelte";
  import type { YirCompaniesSectionProps } from "./YirCompaniesSectionProps";

  const {
    id,
    sectionClass,
    bubblesClass,
    title,
    type,
    companies,
  }: YirCompaniesSectionProps = $props();
</script>

<section class="trakt-yir-companies-section {sectionClass}" {id}>
  <YirPageInner>
    <YirSectionHeader>
      {title}
    </YirSectionHeader>

    <div class={bubblesClass}>
      <YirNetworksChart {companies} {type} />
    </div>
  </YirPageInner>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  section {
    background-color: var(--color-yir-background);
  }

  div {
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
