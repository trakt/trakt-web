<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { page } from "$app/state";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import ActionButton from "../ActionButton.svelte";

  const { title } = $props();
  const data = $derived({
    title,
    text: m.where_to_watch_on_trakt({ title }),
    url: page.url.toString(),
  });

  const isShareable = $derived(
    !!navigator.canShare && navigator.canShare(data),
  );

  const share = async () => {
    if (!isShareable) {
      return;
    }

    try {
      await navigator.share(data);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      throw error;
    }
  };
</script>

{#if isShareable}
  <ActionButton
    label={m.share_title({ title })}
    size="small"
    variant="secondary"
    onclick={share}
  >
    <ShareIcon />
  </ActionButton>
{/if}
