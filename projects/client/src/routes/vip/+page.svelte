<script lang="ts">
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
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
  */
</script>

<TraktPage audience="all" image={DEFAULT_SHARE_COVER} title="VIP">
  <NavbarStateSetter mode="minimal" />

  <Subscriptions />
</TraktPage>
