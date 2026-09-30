<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DropdownGroup from "$lib/components/dropdown/DropdownGroup.svelte";
  import ArrowLeftIcon from "$lib/components/icons/ArrowLeftIcon.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ListTarget } from "$lib/models/ListTarget";
  import { useAllPersonalLists } from "$lib/stores/useAllPersonalLists";
  import { useListedOnIds } from "$lib/stores/useListedOnIds";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import ListDropdownItem from "./ListDropdownItem.svelte";
  import ListPreview from "./_internal/ListPreview.svelte";
  import type { ListPreviewTarget } from "./_internal/ListPreviewTarget";
  import PreviewListButton from "./_internal/PreviewListButton.svelte";
  import WatchlistDropdownItem from "./_internal/WatchlistDropdownItem.svelte";

  const {
    onClose,
    metaInfo,
    target,
    title,
  }: {
    onClose: () => void;
    title: string;
    metaInfo?: string;
    target: ListTarget;
  } = $props();

  const { lists, isLoading: isLoadingLists } = useAllPersonalLists();
  const target$ = fromRune(() => target);
  const { listedOnIds, isLoading: isLoadingIds } = useListedOnIds({ target$ });

  const listedOnIdsSet = $derived(new Set($listedOnIds));
  const sortedLists = $derived(
    $lists.toSorted((a, b) => {
      const aListed = listedOnIdsSet.has(a.id);
      const bListed = listedOnIdsSet.has(b.id);
      if (aListed === bListed) return 0;
      return aListed ? -1 : 1;
    }),
  );

  const categoryIdPrefix = $props.id();
  const { user } = useUser();
  const categories = $derived(
    [
      {
        key: "personal",
        title: m.list_title_personal_lists(),
        lists: sortedLists.filter((list) => list.ownerId === $user.id),
      },
      {
        key: "collaborations",
        title: m.list_title_collaborative_lists(),
        lists: sortedLists.filter((list) => list.ownerId !== $user.id),
      },
    ].filter((category) => category.lists.length > 0),
  );



  let preview = $state<ListPreviewTarget | null>(null);
  const drawerTitle = $derived.by(() => {
    if (!preview) return m.header_manage_lists();
    if (preview.type === "watchlist") return m.list_title_watchlist();
    return preview.list.name;
  });
  const isEmpty = $derived($lists.length === 0);
  const isLoading = $derived(
    !$user.id || (isEmpty && ($isLoadingIds || $isLoadingLists)),
  );
</script>

{#snippet backButton()}
  <ActionButton
    label={m.button_label_back()}
    style="ghost"
    onclick={() => (preview = null)}
  >
    <ArrowLeftIcon />
  </ActionButton>
{/snippet}

<Drawer
  {onClose}
  onDismiss={preview ? () => (preview = null) : onClose}
  title={drawerTitle}
  metaInfo={preview ? undefined : metaInfo}
  leading={preview ? backButton : undefined}
>
  {#if preview}
    <ListPreview target={preview} />
  {:else}
    <div class="lists-layout">
      {#if target.type === "movie" || target.type === "show"}
        <div class="list-rows">
          <div class="list-toggles">
            <DropdownGroup>
              <WatchlistDropdownItem
                media={target.media}
                type={target.type}
                {title}
              />
            </DropdownGroup>
          </div>

          <div class="list-previews">
            <DropdownGroup>
              <PreviewListButton
                label={m.button_label_preview_watchlist()}
                onclick={() => (preview = { type: "watchlist" })}
              />
            </DropdownGroup>
          </div>
        </div>
      {/if}

      {#if isLoading}
        <LoadingIndicator size="small" />
      {:else}
        {#each categories as category (category.key)}
          <section
            class="list-category"
            aria-labelledby="{categoryIdPrefix}-{category.key}"
          >
            <p
              id="{categoryIdPrefix}-{category.key}"
              class="list-category-title tag secondary uppercase"
            >
              {category.title}
            </p>

            <div class="list-rows">
              <div class="list-toggles">
                <DropdownGroup>
                  {#each category.lists as list (list.id)}
                    <ListDropdownItem
                      {title}
                      {list}
                      {target}
                      isListed={listedOnIdsSet.has(list.id)}
                    />
                  {/each}
                </DropdownGroup>
              </div>

              <div class="list-previews">
                <DropdownGroup>
                  {#each category.lists as list (list.id)}
                    <PreviewListButton
                      label={m.button_label_preview_list({ name: list.name })}
                      onclick={() => (preview = { type: "list", list })}
                    />
                  {/each}
                </DropdownGroup>
              </div>
            </div>
          </section>
        {/each}
      {/if}
    </div>
  {/if}
</Drawer>

<style>
  .lists-layout {
    flex-shrink: 0;

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .list-category {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .list-rows {
    display: flex;
    gap: var(--gap-xs);
  }

  .list-toggles {
    flex: 1;
    min-width: 0;
  }

  .list-previews {
    flex: 0 0 var(--ni-40);
  }

  .list-category-title {
    margin: 0;
    padding-inline-start: var(--ni-16);
  }
</style>
