<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import ListsPaginated from "$lib/sections/lists/ListsPaginated.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

<TraktPage
  audience="all"
  title={m.list_title_popular_lists()}
  image={DEFAULT_SHARE_SHOW_COVER}
>
  <NavbarStateSetter
    header={{
      title: m.list_title_popular_lists(),
    }}
  />

  <ListsPaginated type="show" slug={params.slug} />
</TraktPage>
