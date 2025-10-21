<script lang="ts">
  import CtaItem from "../../components/cta/CtaItem.svelte";
</script>

<div class="trakt-personal-lists-placeholder">
  <CtaItem cta={{ type: "personal-list" }} variant="placeholder" />
</div>

<style>
  .trakt-personal-lists-placeholder {
    display: flex;
    justify-content: center;

    padding: var(--layout-distance-side) 0;
  }
</style>
