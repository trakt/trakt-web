<script lang="ts">
  import TogglePills from "$lib/components/toggles/TogglePills.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import * as m from "$lib/features/i18n/messages";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import RelatedPaginatedList from "$lib/sections/lists/RelatedPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const { current, set, options } = useToggler("related");
  const { isEnabled } = useFeatureFlag();
  const isSmartEnabled = isEnabled(FeatureFlag.SmartRelated);
  const isSmart = $derived($isSmartEnabled && $current.value === "smart");
</script>

{#snippet actions()}
  <RenderForFeature flag={FeatureFlag.SmartRelated}>
    {#snippet enabled()}
      <TogglePills value={$current.value} onChange={set} {options} />
    {/snippet}
  </RenderForFeature>
{/snippet}

<TraktPage
  audience="all"
  title={m.list_title_related_movies()}
  image={DEFAULT_SHARE_MOVIE_COVER}
>
  <NavbarStateSetter
    header={{
      title: m.list_title_related_movies(),
      actions,
    }}
  />

  <RelatedPaginatedList type="movie" slug={params.slug} {isSmart} />
</TraktPage>
