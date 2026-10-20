<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DismissIcon from "$lib/components/icons/DismissIcon.svelte";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import { useListItems } from "$lib/sections/lists/user/useListItems";
  import type { Snippet } from "svelte";
  import { getListUrl } from "../components/list-summary/_internal/getListUrl";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import UserListItem from "./_internal/UserListItem.svelte";
  import ListActions from "./ListActions.svelte";

  type UserListProps = {
    list: MediaListSummary;
    type?: DiscoverMode;
    onDismiss?: () => void;
    scope?: string;
    popupActions?: Snippet;
  };

  const { list, type, onDismiss, scope, popupActions }: UserListProps =
    $props();

  const { filterMap } = useFilter();

  const placeholderText = $derived.by(() => {
    switch (type) {
      case "movie":
        return m.list_placeholder_personal_list_empty_movies();
      case "show":
        return m.list_placeholder_personal_list_empty_shows();
      default:
        return m.list_placeholder_personal_list_empty();
    }
  });
</script>

<DrillableMediaList
  --height-override-card="var(--height-portrait-card-sm)"
  --height-override-list="var(--height-poster-list-sm)"
  {type}
  source={{ id: "user-list", type }}
  id={{
    scope: scope ?? "user-list",
    key: `${type}-${list.id}`,
  }}
  drilldownLabel={m.button_text_view_all()}
  filter={$filterMap}
  useList={(params) => useListItems({ list, ...params })}
  urlBuilder={() => getListUrl({ type: "user-list", list })}
  title={list.name}
  count={list.count}
  collapsible={!onDismiss}
>
  {#snippet item(media)}
    <UserListItem listedItem={media} style="cover" {list} />
  {/snippet}

  {#snippet actions()}
    {#if onDismiss}
      <ActionButton
        onclick={onDismiss}
        label={m.button_label_dismiss()}
        style="ghost"
        color="default"
      >
        <DismissIcon />
      </ActionButton>
    {/if}
    <ListActions {list} {popupActions} />
  {/snippet}

  {#snippet empty()}
    {placeholderText}
  {/snippet}
</DrillableMediaList>
