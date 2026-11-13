<script lang="ts">
  import AvatarPill from "$lib/components/avatar-pill/AvatarPill.svelte";
  import LiveDot from "$lib/components/live-dot/LiveDot.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaSocialQueryTarget } from "$lib/requests/queries/media/mediaSocialQuery.ts";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { useMediaWatching } from "./useMediaWatching.ts";

  const AVATAR_LIMIT = 3;

  const { target, title }: { target: MediaSocialQueryTarget; title: string } =
    $props();

  const { total, followed } = useMediaWatching(fromRune(() => target));

  const avatars = $derived(
    $followed.slice(0, AVATAR_LIMIT).map((user) => ({ key: user.key, user })),
  );

  const countLabel = $derived(toHumanNumber($total, languageTag()));

  const { buildDrawerLink } = summaryDrawerNavigation();
  const drawerLink = $derived(buildDrawerLink(SummaryDrawers.Social));
</script>

{#snippet liveIndicator()}
  <LiveDot />
{/snippet}

{#if avatars.length > 0}
  <AvatarPill
    {avatars}
    {countLabel}
    label={m.tag_text_watching_now_live()}
    href={drawerLink.href}
    noscroll={drawerLink.noscroll}
    replacestate={drawerLink.replacestate}
    ariaLabel={m.link_label_watching_now_social({ count: $total, title })}
    indicator={liveIndicator}
    color="red"
  />
{:else if $total > 0}
  <AvatarPill
    avatars={[]}
    {countLabel}
    label={m.tag_text_watching_now_live()}
    indicator={liveIndicator}
    color="red"
  />
{/if}
