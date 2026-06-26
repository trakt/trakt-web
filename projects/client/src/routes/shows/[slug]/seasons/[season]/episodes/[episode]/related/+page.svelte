<script lang="ts">
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import RelatedPaginatedList from "$lib/sections/lists/RelatedPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { current, set, options } = useToggler("related");
  const isSmart = $derived($current.value === "smart");
</script>

{#snippet metaInfo()}
  <RenderForFeature flag={FeatureFlag.SmartRelated} audience="director">
    {#snippet enabled()}
      <ListMetaInfo text={$current.text()} />
    {/snippet}
  </RenderForFeature>
{/snippet}

{#snippet actions()}
  <RenderForFeature flag={FeatureFlag.SmartRelated} audience="director">
    {#snippet enabled()}
      <Toggler value={$current.value} onChange={set} {options} variant="icon" />
    {/snippet}
  </RenderForFeature>
{/snippet}

<TraktPage
  audience="all"
  title={m.list_title_related_shows()}
  image={DEFAULT_SHARE_SHOW_COVER}
>
  <NavbarStateSetter
    header={{
      title: m.list_title_related_shows(),
      metaInfo,
      actions,
    }}
  />

  <RelatedPaginatedList type="show" slug={params.slug} {isSmart} />
</TraktPage>
