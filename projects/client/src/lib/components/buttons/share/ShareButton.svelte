<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { page } from "$app/state";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import ActionButton from "../ActionButton.svelte";

  type ShareButtonProps = {
    title: string;
    textFactory: ({ title }: { title: string }) => string;
  };

  const { title, textFactory }: ShareButtonProps = $props();

  const data = $derived({
    title,
    text: textFactory({ title }),
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
  <ActionButton label={m.share_title({ title })} onclick={share}>
    <ShareIcon />
  </ActionButton>
{/if}
