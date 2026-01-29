<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import ManageSubscriptions from "./_internal/ManageSubscriptions.svelte";
  import Subscriptions from "./_internal/Subscriptions.svelte";

  /*
    TODO:
    - Intl
    - Design
    - Extract
    - Payment links (proper price & campaign management/definitions)
    - Version for users who are already VIP
    - Auth guard
    - 'Most popular' badge
    - Payment history?
    - renew
  */

  // TODO placeholder for people who signed up via apple/google
</script>

<TraktPage audience="all" image={DEFAULT_SHARE_COVER} title="VIP">
  <NavbarStateSetter mode="minimal" />

  <RenderFor audience="free">
    <Subscriptions />
  </RenderFor>

  <RenderFor audience="vip">
    <ManageSubscriptions />
  </RenderFor>
</TraktPage>
