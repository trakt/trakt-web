<script lang="ts">
  import CtaItem from "../../components/cta/CtaItem.svelte";
  import type { ListCta } from "../../components/cta/models/Cta";

  const { cta }: { cta: ListCta } = $props();
</script>

<div class="trakt-personal-lists-placeholder">
  <CtaItem {cta} variant="placeholder" />
</div>

<style>
  .trakt-personal-lists-placeholder {
    display: flex;
    justify-content: center;

    padding: var(--layout-distance-side) 0;
  }
</style>
