<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import CreditsHistoryPaginatedList from "$lib/sections/lists/history/CreditsHistoryPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { usePerson } from "../usePerson";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { person, isLoading } = $derived(usePerson(params.slug));

  const title = $derived.by(() => {
    if ($isLoading || !$person) return m.list_title_from_my_history();

    return `${$person.name} - ${m.list_title_from_my_history()}`;
  });
</script>

<TraktPage audience="authenticated" {title} image={DEFAULT_SHARE_COVER}>
  <NavbarStateSetter
    header={{
      title,
    }}
  />

  {#if $isLoading || !$person}
    <LoadingIndicator />
  {:else}
    <CreditsHistoryPaginatedList slug={params.slug} name={$person.name} />
  {/if}
</TraktPage>
