<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import InfoTag from "$lib/components/media/tags/InfoTag.svelte";
</script>

<div class="watchlist-tag">
  <InfoTag>
    {m.tag_text_movies()}
  </InfoTag>
  <InfoTag>
    {m.tag_text_released()}
  </InfoTag>
</div>

<style>
  .watchlist-tag {
    display: flex;
    align-items: center;
    gap: var(--ni-4);
  }
</style>
