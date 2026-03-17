<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import VipManage from "$lib/sections/vip/VipManage.svelte";
  import VipSubscribe from "$lib/sections/vip/VipSubscribe.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
</script>

<TraktPage audience="authenticated" image={DEFAULT_SHARE_COVER} title="VIP">
  <NavbarStateSetter mode="minimal" />

  <RenderFor audience="free">
    <VipSubscribe />
  </RenderFor>

  <RenderFor audience="vip">
    <VipManage />
  </RenderFor>
</TraktPage>
