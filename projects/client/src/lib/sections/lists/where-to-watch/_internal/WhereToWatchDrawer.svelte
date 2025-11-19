<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { getLanguageAndRegion } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MetaInfoProps } from "$lib/sections/summary/components/media/useMediaMetaInfo";
  import { toCountryName } from "$lib/utils/formatting/intl/toCountryName";
  import { writable } from "svelte/store";
  import LoadingIndicator from "../../drilldown/_internal/LoadingIndicator.svelte";
  import { toCountryFlag } from "./toCountryFlag";
  import { useAllStreamOn } from "./useAllStreamOn";
  import WhereToWatchItem from "./WhereToWatchItem.svelte";

  const { ...target }: MetaInfoProps = $props();

  const { list, isLoading } = $derived(useAllStreamOn(target));
  const isOpen = writable(false);
  const onClose = () => isOpen.set(false);

  const { language } = getLanguageAndRegion();

  const sortedList = $derived(
    $list
      .map((entry) => ({
        ...entry,
        countryName: toCountryName(entry.country, language),
      }))
      .sort((a, b) => a.countryName.localeCompare(b.countryName)),
  );
</script>

<ActionButton
  label={m.button_label_view_all_where_to_watch()}
  onclick={() => isOpen.set(!$isOpen)}
  style="ghost"
>
  <CaretRightIcon />
</ActionButton>

{#if $isOpen}
  <Drawer {onClose} title={m.list_title_where_to_watch()} size="large">
    <div class="trakt-where-to-watch-lists">
      {#each sortedList as entry}
        <SectionList
          id={`where-to-watch-${target.media.slug}-${entry.country}`}
          items={entry.services}
          title={`${toCountryFlag(entry.country)} ${entry.countryName}`}
          --height-list="var(--height-where-to-watch-list)"
        >
          {#snippet item(service)}
            <WhereToWatchItem {service} country={entry.country} />
          {/snippet}

          {#snippet empty()}
            <p class="secondary">{m.button_text_no_services()}</p>
          {/snippet}
        </SectionList>
      {/each}

      {#if $isLoading}
        <LoadingIndicator />
      {/if}

      {#if $isLoading && $list.length === 0}
        <p class="secondary">{m.button_text_no_services()}</p>
      {/if}
    </div>
  </Drawer>
{/if}

<style>
  .trakt-where-to-watch-lists {
    :global(.trakt-list-header) {
      margin: 0;

      :global(.trakt-action-button) {
        display: none;
      }
    }

    :global(.trakt-list-item-container) {
      padding: 0;
    }

    :global(.section-list) {
      margin-left: 0;
    }
  }
</style>
