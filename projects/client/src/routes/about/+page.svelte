<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import About from "$lib/sections/about/About.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="all"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_about()}
>
  <About />
</TraktPage>
