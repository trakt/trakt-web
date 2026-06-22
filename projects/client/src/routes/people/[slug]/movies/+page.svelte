<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import CreditsPaginatedList from "$lib/sections/lists/CreditsPaginatedList.svelte";
  import CreditsPositionSelector from "$lib/sections/lists/components/CreditsPositionSelector.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { usePerson } from "../usePerson";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { person, isLoading } = usePerson(fromRune(() => params.slug));

  const title = $derived.by(() => {
    if ($isLoading || !$person) return m.list_title_movie_credits();

    return `${$person.name} - ${m.list_title_movie_credits()}`;
  });
</script>

{#snippet headerActions()}
  <CreditsPositionSelector slug={params.slug} type="movie" />
{/snippet}

<TraktPage audience="all" {title} image={DEFAULT_SHARE_COVER}>
  <NavbarStateSetter
    hasFilters
    header={{
      title,
      actions: headerActions,
    }}
  />

  <CreditsPaginatedList slug={params.slug} type="movie" />
</TraktPage>
