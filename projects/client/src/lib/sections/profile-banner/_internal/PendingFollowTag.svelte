<script lang="ts">
  import HourglassIcon from "$lib/components/icons/HourglassIcon.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
</script>

<div class="trakt-pending-follow-tag">
  <TextTag classList="pending-follow-tag">
    {#snippet icon()}
      <HourglassIcon />
    {/snippet}
    <span class="tag bold uppercase">{m.tag_text_follow_request_pending()}</span>
  </TextTag>
</div>

<style lang="scss">
  .trakt-pending-follow-tag {
    :global(.pending-follow-tag) {
      background-color: var(--color-foreground-orange);
      color: var(--color-background-orange);

      border-radius: var(--border-radius-xxl);
      padding: var(--ni-8) var(--ni-10);
      padding-left: var(--ni-8);

      :global(svg) {
        width: var(--ni-14);
        height: var(--ni-14);
      }
    }
  }
</style>
