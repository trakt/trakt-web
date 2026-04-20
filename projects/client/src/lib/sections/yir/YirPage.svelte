<script lang="ts">
  import YirDefault from "./default/YirDefault.svelte";
  import YirTitleSection from "./default/_internal/YirTitleSection.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { useYirDetail } from "./_internal/useYirDetail";

  const { slug, year }: { slug: string; year: number } = $props();

  const { detail, isLoading } = $derived(
    useYirDetail({ slug, year }),
  );
</script>

<div class="yir-page" id="year-in-review">
  <YirTitleSection {slug} {year} coverImage={$detail?.images.cover} />

  {#if $isLoading}
    <div class="yir-loading">
      <LoadingIndicator />
    </div>
  {:else if $detail}
    <YirDefault detail={$detail} {slug} {year} />
  {/if}
</div>

<style lang="scss">
  .yir-page {
    display: flex;
    flex-direction: column;
    background-color: var(--shade-950);
    color: var(--shade-10);
    overflow-x: hidden;
  }

  .yir-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--ni-96) 0;
    color: var(--shade-10);
  }
</style>
