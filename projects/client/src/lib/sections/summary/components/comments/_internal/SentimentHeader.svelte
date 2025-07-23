<script lang="ts">
  import CircularLogo from "$lib/components/icons/CircularLogo.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
</script>

<div class="trakt-sentiment-header">
  <CircularLogo variant="gradient" />
  <div class="trakt-sentiment-details">
    <p>{m.header_community_sentiment()}</p>
  </div>
</div>

<style>
  .trakt-sentiment-header {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    height: var(--ni-32);

    position: relative;
  }
</style>
