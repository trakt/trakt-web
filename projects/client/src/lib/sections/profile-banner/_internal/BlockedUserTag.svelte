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
    <p>{m.tag_text_blocked_user()}</p>
  </TextTag>
</div>

<style lang="scss">
  .trakt-blocked-user-tag {
    :global(.trakt-text-tag) {
      background-color: color-mix(
        in srgb,
        var(--color-background-red) 20%,
        transparent
      );
      color: var(--color-background-red);

      border-radius: var(--border-radius-xxl);
      padding: var(--ni-8) var(--ni-12);

      :global(p) {
        font-weight: bold;
        text-transform: uppercase;
        font-size: var(--font-size-text);
      }
    }
  }
</style>
