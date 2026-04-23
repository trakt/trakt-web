<script lang="ts">
  import BlockIcon from "$lib/components/icons/BlockIcon.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
</script>

<div class="trakt-blocked-user-tag">
  <TextTag>
    {#snippet icon()}
      <BlockIcon />
    {/snippet}
    <span class="tag bold uppercase">{m.tag_text_blocked_user()}</span>
  </TextTag>
</div>

<style lang="scss">
  .trakt-blocked-user-tag {
    :global(.trakt-text-tag) {
      background-color: var(--color-foreground-red);
      color: var(--color-background-red);

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
