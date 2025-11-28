<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import DiscoverToggles from "$lib/sections/discover/DiscoverToggles.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import PersonalListsPaginated from "$lib/sections/lists/user/PersonalListsPaginated.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
  const { user } = useUser();
  const { isMe } = $derived(useIsMe(params.user));
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_lists()}
>
  {#if !$isMe}
    <Redirect to={UrlBuilder.profile.user(params.user)} />
  {/if}

  <TraktPageCoverSetter />

  <NavbarStateSetter hasFilters>
    {#snippet actions()}
      <DiscoverToggles />
    {/snippet}
  </NavbarStateSetter>

  <PersonalListsPaginated type="liked" slug={$user.slug} />
</TraktPage>
