<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import Landing from "$lib/sections/landing/Landing.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
</script>

<TraktPage
  audience="public"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_home()}
  info={{ overview: m.page_description_home() }}
  type="home"
  mode="content-only"
>
  <NavbarStateSetter mode="hidden" />

  <Landing />
</TraktPage>
