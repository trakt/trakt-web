<script lang="ts">
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
</script>

<trakt-most-popular-tag>
  <TextTag><p>{m.tag_text_most_popular()}</p></TextTag>
</trakt-most-popular-tag>

<style>
  trakt-most-popular-tag {
    z-index: var(--layer-raised);

    position: absolute;
    top: 0;
    transform: translateY(-50%);

    :global(.trakt-text-tag) {
      background-color: var(--color-vip-popular-tag);
      color: var(--shade-900);
      border-radius: var(--border-radius-xxl);
      padding: var(--ni-4) var(--ni-12);
    }

    p {
      text-transform: uppercase;
      font-weight: bold;
    }
  }
</style>
