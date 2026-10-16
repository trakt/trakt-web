<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import Mixtape from "$lib/sections/mixtape/Mixtape.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets.ts";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_mixtape()}
>
  <NavbarStateSetter mode="minimal" />

  <Mixtape />
</TraktPage>
