<script>
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";

  import SocialActivityPaginatedList from "$lib/sections/lists/social/SocialActivityPaginatedList.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
</script>

<TraktPage
  audience="authenticated"
  image={DEFAULT_SHARE_COVER}
  title={m.social_activity_title()}
>
  <TraktPageCoverSetter />

  <SocialActivityPaginatedList title={m.social_activity_title()} />
</TraktPage>
