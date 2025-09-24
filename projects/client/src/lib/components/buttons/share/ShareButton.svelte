<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages";
  import type { DrilldownSource } from "$lib/sections/lists/components/models/DrilldownSource";
  import ActionButton from "../ActionButton.svelte";

  type ShareButtonProps = {
    title: string;
    textFactory: ({ title }: { title: string }) => string;
    urlOverride?: string;
    style?: "action" | "dropdown-item";
    source: DrilldownSource;
  };

  const {
    title,
    textFactory,
    urlOverride,
    source,
    style = "action",
  }: ShareButtonProps = $props();

  const { track } = useTrack(AnalyticsEvent.Share);

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
      track({ source: source.id, type: source.type });
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
  {#if style === "action"}
    <ActionButton
      label={m.button_label_share({ title })}
      style="ghost"
      onclick={share}
    >
      <ShareIcon />
    </ActionButton>
  {/if}

  {#if style === "dropdown-item"}
    <DropdownItem
      color="default"
      variant="secondary"
      style="flat"
      onclick={share}
    >
      {m.button_text_share()}
      {#snippet icon()}
        <ShareIcon />
      {/snippet}
    </DropdownItem>
  {/if}
{/if}
