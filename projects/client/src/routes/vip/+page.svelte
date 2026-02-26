<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import ManageSubscription from "$lib/sections/vip/ManageSubscription.svelte";
  import VipUpsellContent from "$lib/sections/vip/VipUpsellContent.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
</script>

<TraktPage audience="authenticated" image={DEFAULT_SHARE_COVER} title="VIP">
  <NavbarStateSetter mode="minimal" />

  <RenderFor audience="free">
    <VipUpsellContent />
  </RenderFor>

  <RenderFor audience="vip">
    <ManageSubscription />
  </RenderFor>
</TraktPage>
