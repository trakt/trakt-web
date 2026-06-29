<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import PersonalListsPaginated from "$lib/sections/lists/user/PersonalListsPaginated.svelte";
  import ResponsiveNavbarStateSetter from "$lib/sections/navbar/ResponsiveNavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
  const { user } = useUser();
  const { isMe } = $derived(useIsMe(params.user));

  const { current } = useDiscover();
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

  <ResponsiveNavbarStateSetter
    hasFilters
    header={{ title: m.list_title_liked_lists(), metaInfo: $current.text() }}
  />

  <PersonalListsPaginated type="liked" slug={$user.slug} />
</TraktPage>
