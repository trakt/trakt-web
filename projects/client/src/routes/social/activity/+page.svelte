<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import SocialActivityPaginatedList from "$lib/sections/lists/activity/SocialActivityPaginatedList.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.page_title_social_activity()}
>
  <TraktPageCoverSetter />

  <SocialActivityPaginatedList title={m.list_title_social_activity()} />
</TraktPage>
