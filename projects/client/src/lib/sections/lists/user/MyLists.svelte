<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler.ts";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import type { Cta } from "../components/cta/models/Cta.ts";
  import ListSummaryItem from "../components/list-summary/ListSummaryItem.svelte";
  import SmartListSummaryItem from "../smart/SmartListSummaryItem.svelte";
  import SmartListTemplates from "../smart/templates/SmartListTemplates.svelte";
  import SmartListTemplatesLink from "../smart/templates/SmartListTemplatesLink.svelte";
  import { useSmartListTemplates } from "../smart/templates/useSmartListTemplates.ts";
  import CreateListMenu from "./_internal/CreateListMenu.svelte";
  import LeaveCollaborationButton from "./_internal/LeaveCollaborationButton.svelte";
  import SaveListDrawer from "./_internal/SaveListDrawer.svelte";
  import { useMyLists } from "./useMyLists.ts";

  const { slug, mode }: { slug: string; mode: DiscoverMode } = $props();

  const { current, options, set } = useToggler("myLists");
  const type = $derived($current.value);

  const { items, isLoading } = $derived(useMyLists({ type, slug, mode }));

  const {
    templates,
    presentation,
    isLoading: areTemplatesLoading,
    hide: hideTemplates,
  } = useSmartListTemplates(fromRune(() => mode));

  const hasTemplates = $derived(type === "smart" && $templates.length > 0);
  const hasStrip = $derived(hasTemplates && $presentation === "strip");
  const hasLink = $derived(hasTemplates && $presentation === "link");

  const drilldown = $derived({
    href:
      type === "smart"
        ? UrlBuilder.lists.smart.all()
        : UrlBuilder.lists.all(slug, type),
    label: m.button_label_view_all_lists(),
    source:
      type === "smart" ? { id: "smart-lists" } : { id: "personal-lists", type },
    mode: "always" as const,
  });

  const showCreateList = writable(false);

  const cta: Cta = $derived({
    type: "personal-list",
    mediaType: mode === "media" ? undefined : mode,
    action: {
      onClick: () => showCreateList.set(true),
      disabled: false,
    },
  });
</script>

{#snippet listActions()}
  <Toggler
    value={type}
    onChange={set}
    {options}
    variant="selected-icon"
    style="minimal"
    --segmented-select-scroll-inset="var(--list-actions-inset)"
    --segmented-select-scroll-fade="var(--list-actions-inset)"
    ariaLabel={m.list_title_personal_lists()}
  />
{/snippet}

{#snippet actions()}
  <CreateListMenu />
{/snippet}

<SectionList
  id={{ scope: "my-lists" }}
  items={$items}
  title={m.list_title_personal_lists()}
  {drilldown}
  {actions}
  {listActions}
  --list-actions-height="var(--segmented-select-minimal-segment-height)"
  --height-list="var(--height-lists-list)"
  --height-override-list={$items.length === 0
    ? hasStrip
      ? "0px"
      : "var(--height-poster-list-sm)"
    : undefined}
>
  {#snippet item(entry)}
    {#if entry.kind === "smart"}
      <SmartListSummaryItem list={entry.list} />
    {:else}
      {#snippet popupActions()}
        <LeaveCollaborationButton list={entry.list} />
      {/snippet}

      <ListSummaryItem
        list={entry.list}
        popupActions={type === "collaboration" ? popupActions : undefined}
        markOwned={type === "collaboration"}
      />
    {/if}
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      {#if type === "smart"}
        {#if !hasStrip && !$areTemplatesLoading}
          <CtaItem cta={{ type: "smart-list" }} variant="placeholder" />
        {/if}
      {:else if type === "personal"}
        <CtaItem {cta} variant="placeholder" />
      {:else}
        {m.list_placeholder_personal_list_empty()}
      {/if}
    {/if}
  {/snippet}
</SectionList>

{#if hasStrip}
  <SmartListTemplates templates={$templates} onHide={hideTemplates} />
{/if}

{#if hasLink}
  <SmartListTemplatesLink templates={$templates} />
{/if}

{#if $showCreateList}
  <SaveListDrawer type="create" onClose={() => showCreateList.set(false)} />
{/if}
