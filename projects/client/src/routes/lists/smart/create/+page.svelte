<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import SmartListCreator from "$lib/sections/smart-lists/SmartListCreator.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { mode } = useDiscover();

  const { limits } = useUser();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_create_smart_list()}
>
  <TraktPageCoverSetter />
  <NavbarStateSetter mode="minimal" hasFilters />

  {#if $limits}
    <SmartListCreator mode={$mode} limits={$limits} />
  {/if}
</TraktPage>
