<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import FastRewindIcon from "$lib/components/icons/FastRewindIcon.svelte";
  import IconWrapper from "$lib/components/icons/IconWrapper.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import { useHasWatchedShowEpisodes } from "./useHasWatchedShowEpisodes";
  import { useRewatching } from "./useRewatching";

  type RewatchingActionProps = {
    show: ShowEntry;
    title: string;
    startLink: {
      href: string;
      noscroll: boolean;
      replacestate: boolean;
    };
  };

  const {
    show,
    title,
    startLink,
  }: RewatchingActionProps = $props();

  const { hasWatchedShowEpisodes } = $derived(
    useHasWatchedShowEpisodes({ type: "show", media: show }),
  );
  const { isRewatching, stopRewatching, isUpdatingRewatching } = $derived(
    useRewatching({ show }),
  );

  const isVisible = $derived($isRewatching || $hasWatchedShowEpisodes);

  const onStopRewatching = () => stopRewatching();
</script>

{#snippet rewindIcon()}
  <IconWrapper isLoading={$isUpdatingRewatching}>
    <FastRewindIcon />
  </IconWrapper>
{/snippet}

{#if isVisible}
  {#if $isRewatching}
    <DropdownItem
      onclick={onStopRewatching}
      label={m.button_label_stop_rewatching({ title })}
      disabled={$isUpdatingRewatching}
      icon={rewindIcon}
    >
      {m.button_text_stop_rewatching()}
    </DropdownItem>
  {:else}
    <DropdownItem
      {...startLink}
      label={m.button_label_start_rewatching({ title })}
      disabled={$isUpdatingRewatching}
      icon={rewindIcon}
    >
      {m.button_text_start_rewatching()}
    </DropdownItem>
  {/if}
{/if}
