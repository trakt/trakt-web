<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import SmartListConvertCompare from "$lib/sections/smart-lists/SmartListConvertCompare.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_convert_smart_list()}
  hasDynamicContent={true}
>
  <TraktPageCoverSetter />

  {#key params.list}
    <SmartListConvertCompare slug={params.list} />
  {/key}
</TraktPage>
