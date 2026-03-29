<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import SmartListRenderer from "$lib/sections/lists/smart/SmartListRenderer.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const { mode } = useDiscover();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_smart_lists()}
>
  <TraktPageCoverSetter />

  <NavbarStateSetter header={{ title: m.list_title_smart_lists() }} />

  <SmartListRenderer mode={$mode} limit={100} />
</TraktPage>
