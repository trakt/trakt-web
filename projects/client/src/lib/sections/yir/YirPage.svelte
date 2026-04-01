<script lang="ts">
  import YirDefault from "./default/YirDefault.svelte";
  import { useYirDetail } from "./_internal/useYirDetail";

  const { slug, year }: { slug: string; year: number } = $props();

  const { detail, isLoading } = $derived(
    useYirDetail({ slug, year }),
  );
</script>

{#if $isLoading}
  <div class="yir-loading">
    <p>Loading year in review...</p>
  </div>
{:else if $detail}
  <YirDefault detail={$detail} {slug} {year} />
{/if}

<style lang="scss">
  .yir-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
    color: var(--shade-10);
  }
</style>
