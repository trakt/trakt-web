<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import Terms from "$lib/sections/terms/Terms.svelte";
</script>

<TraktPage audience="all" image={DEFAULT_SHARE_COVER} title={m.page_title_terms()}>
  <Terms />
</TraktPage>
