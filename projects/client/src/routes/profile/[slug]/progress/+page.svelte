<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler.ts";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe.ts";
  import { m } from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import { useListSorting } from "$lib/sections/lists/user/_internal/useListSorting.ts";
  import ListSortActions from "$lib/sections/lists/user/ListSortActions.svelte";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import ProgressPaginatedList from "$lib/sections/profile/components/ProgressPaginatedList.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { current, set, options } = useToggler("progress");

  const { isMe } = $derived(useIsMe(params.slug));

  const {
    current: currentSort,
    update,
    options: sortOptions,
    urlBuilder,
  } = $derived(useListSorting({ type: "progress", slug: params.slug }));

  const progressSortOptions = $derived(
    sortOptions.filter((o) => o.value !== "added"),
  );
</script>

{#snippet actions()}
  <Toggler value={$current.value} onChange={set} {options} />
{/snippet}

{#if !$isMe}
  <Redirect to={UrlBuilder.profile.user(params.slug)} />
{:else}
  <TraktPage
    audience="authenticated"
    image={DEFAULT_SHARE_COVER}
    title={m.page_title_progress()}
  >
    <TraktPageCoverSetter />

    <ResponsiveNavbarStateSetter
      header={{
        title: m.list_title_progress(),
        metaInfo: $current.text(),
        actions,
      }}
    >
      {#snippet headerActions()}
        {#if $current.value !== "dropped"}
          <ListSortActions
            options={progressSortOptions}
            {urlBuilder}
            current={$currentSort}
            onUpdate={update}
          />
        {/if}
      {/snippet}
    </ResponsiveNavbarStateSetter>

    <ProgressPaginatedList
      type={$current.value}
      sortBy={$currentSort.sorting.value}
      sortHow={$currentSort.sortHow}
    />
  </TraktPage>
{/if}
