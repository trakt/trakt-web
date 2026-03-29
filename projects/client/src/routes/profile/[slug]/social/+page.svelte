<script lang="ts">
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { m } from "$lib/features/i18n/messages";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import ProfileListPaginated from "$lib/sections/profile/components/ProfileListPaginated.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { current, set, options } = useToggler("social");
</script>

{#snippet actions()}
  <Toggler value={$current.value} onChange={set} {options} />
{/snippet}

{#snippet metaInfo()}
  <ListMetaInfo text={$current.text()} />
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
      metaInfo,
    }}
  />

  <ProfileListPaginated slug={params.slug} type={$current.value} />
</TraktPage>
