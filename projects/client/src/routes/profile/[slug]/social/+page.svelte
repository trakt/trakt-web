<script lang="ts">
  import { m } from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import ProfileListPaginated from "$lib/sections/profile/components/ProfileListPaginated.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_social()}
>
  <TraktPageCoverSetter />

  <NavbarStateSetter mode="minimal" />

  <ProfileListPaginated slug={params.slug} />
</TraktPage>
