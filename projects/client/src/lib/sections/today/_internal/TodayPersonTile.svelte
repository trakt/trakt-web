<script lang="ts">
  import IndicatorTags from "$lib/components/tags/IndicatorTags.svelte";
  import WatchedTag from "$lib/components/media/tags/WatchedTag.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { dedupe } from "$lib/utils/array/dedupe.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import type { TodayPersonGroup } from "../models/TodayPersonGroup.ts";
  import TodayTile from "./TodayTile.svelte";
  import TodayTileFaces from "./TodayTileFaces.svelte";
  import { hasWatchedToo } from "./hasWatchedToo.ts";

  const { group, onOpen }: { group: TodayPersonGroup; onOpen: () => void } =
    $props();

  const { history } = useUser();

  const name = $derived(toDisplayableName(group.user));
  const latest = $derived(group.actions.at(0));
  const isWatchedToo = $derived(
    latest
      ? hasWatchedToo({ history: $history, media: latest.media })
      : false,
  );
  const label = $derived(
    isWatchedToo ? `${name}, ${m.tag_text_today_watched_too()}` : name,
  );
  const titleCount = $derived(
    dedupe((action) => action.media.key, [...group.actions]).length,
  );
</script>

<TodayTile {label} {onOpen}>
  <CardCover
    title={latest?.media.title ?? name}
    src={latest?.media.poster.url.thumb ?? group.user.avatar.url}
    alt=""
  >
    {#snippet badge()}
      <TodayTileFaces users={[group.user]} />
    {/snippet}
  </CardCover>
  {#if isWatchedToo}
    <IndicatorTags>
      <WatchedTag />
    </IndicatorTags>
  {/if}
  <CardFooter>
    <p class="trakt-card-title ellipsis">{name}</p>
    <p class="trakt-card-subtitle ellipsis">
      {titleCount === 1
        ? m.text_today_titles_one()
        : m.text_today_titles_other({ count: titleCount })}
    </p>
  </CardFooter>
</TodayTile>
