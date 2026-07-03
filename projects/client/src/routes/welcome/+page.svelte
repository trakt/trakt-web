<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import Welcome from "$lib/sections/welcome/Welcome.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_welcome()}
  mode="content-only"
>
  <NavbarStateSetter mode="hidden" />
  <Welcome />
</TraktPage>
