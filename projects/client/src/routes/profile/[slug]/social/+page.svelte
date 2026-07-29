<script lang="ts">
  import TogglePills from "$lib/components/toggles/TogglePills.svelte";
  import { m } from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import ProfileListPaginated from "$lib/sections/profile/components/ProfileListPaginated.svelte";
  import { useProfileSocialToggler } from "$lib/sections/profile/stores/useProfileSocialToggler";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { current, set, options } = $derived(
    useProfileSocialToggler(params.slug),
  );
</script>

{#snippet actions()}
  <TogglePills value={$current.value} onChange={set} options={$options} />
{/snippet}

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_social()}
>
  <TraktPageCoverSetter />

  <NavbarStateSetter
    header={{
      title: m.list_title_social(),
      actions,
    }}
  />

  <ProfileListPaginated slug={params.slug} type={$current.value} />
</TraktPage>
