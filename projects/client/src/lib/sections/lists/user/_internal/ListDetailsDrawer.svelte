<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import ClampedText from "$lib/components/text/ClampedText.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import MarkdownText from "$lib/sections/components/markdown/MarkdownText.svelte";
  import { fade } from "svelte/transition";
  import ListFeaturedPeople from "./ListFeaturedPeople.svelte";

  const { list, onClose }: {
    list: MediaListSummary;
    onClose: () => void;
  } = $props();

  let isOpen = $state(false);
</script>

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.header_details()}
  metaInfo={list.name}
  size="large"
>
  {#if isOpen}
    <div
      class="trakt-list-details-drawer"
      transition:fade={{ duration: 150 }}
    >
      <section class="details-section">
        <span class="bold secondary">{m.header_list_description()}</span>

        <div class="details-card">
          {#if list.description}
            <ClampedText
              label={m.button_label_read_more()}
              lineCount={5}
              as="div"
            >
              <MarkdownText text={list.description} />
            </ClampedText>
          {:else}
            <p class="secondary">{m.text_list_no_description()}</p>
          {/if}
        </div>
      </section>

      <ListFeaturedPeople listId={list.id} />
    </div>
  {/if}
</Drawer>

<style>
  .trakt-list-details-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    .details-section {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }

    .details-card {
      padding: var(--ni-16);
      border-radius: var(--border-radius-m);
      background: color-mix(in srgb, var(--color-foreground) 4%, transparent);
      overflow-wrap: anywhere;
    }
  }
</style>
