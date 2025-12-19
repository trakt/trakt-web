<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { DrilldownSource } from "$lib/sections/lists/components/models/DrilldownSource";
  import ActionButton from "../ActionButton.svelte";
  import { useShare } from "./useShare";

  type ShareButtonProps = {
    title: string;
    textFactory: ({ title }: { title: string }) => string;
    urlOverride?: string;
    style?: "action" | "dropdown-item";
    source: DrilldownSource;
    variant?: "primary" | "secondary";
  };

  const {
    title,
    textFactory,
    urlOverride,
    source,
    style = "action",
    variant = "secondary",
  }: ShareButtonProps = $props();

  const data = $derived({
    title,
    text: textFactory({ title }),
    url: urlOverride ?? page.url.toString(),
  });

  const isShareable = $derived(
    browser && !!navigator.canShare && navigator.canShare(data),
  );
  const { share: shareFn } = $derived(useShare(source));
  const share = $derived(() => shareFn(data));
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
    <DropdownItem color="default" style="flat" onclick={share} {variant}>
      {m.button_text_share()}
      {#snippet icon()}
        <ShareIcon />
      {/snippet}
    </DropdownItem>
  {/if}
{/if}
