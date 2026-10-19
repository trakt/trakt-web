<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import VipCancel from "$lib/sections/vip/VipCancel.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets.ts";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_vip_cancel()}
>
  <NavbarStateSetter mode="minimal" />

  <VipCancel />
</TraktPage>
