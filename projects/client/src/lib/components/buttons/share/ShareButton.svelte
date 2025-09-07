<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import ActionButton from "../ActionButton.svelte";

  type ShareButtonProps = {
    title: string;
    textFactory: ({ title }: { title: string }) => string;
    urlOverride?: string;
    style?: "flat" | "ghost";
  };

  const {
    title,
    textFactory,
    urlOverride,
    style = "flat",
  }: ShareButtonProps = $props();

  const data = $derived({
    title,
    text: textFactory({ title }),
    url: urlOverride ?? page.url.toString(),
  });

  const isShareable = $derived(
    browser && !!navigator.canShare && navigator.canShare(data),
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
  <ActionButton label={m.button_label_share({ title })} {style} onclick={share}>
    <ShareIcon />
  </ActionButton>
{/if}
