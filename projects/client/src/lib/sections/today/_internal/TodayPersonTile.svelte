<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { dedupe } from "$lib/utils/array/dedupe.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import type { TodayPersonGroup } from "../models/TodayPersonGroup.ts";
  import TodayTile from "./TodayTile.svelte";
  import TodayTileFaces from "./TodayTileFaces.svelte";

  const { group, onOpen }: { group: TodayPersonGroup; onOpen: () => void } =
    $props();

  const name = $derived(toDisplayableName(group.user));
  const latest = $derived(group.actions.at(0));
  const titleCount = $derived(
    dedupe((action) => action.media.key, [...group.actions]).length,
  );
</script>

<TodayTile label={name} {onOpen}>
  <CardCover
    title={latest?.media.title ?? name}
    src={latest?.media.poster.url.thumb ?? group.user.avatar.url}
    alt=""
  >
    {#snippet badge()}
      <TodayTileFaces users={[group.user]} />
    {/snippet}
  </CardCover>
  <CardFooter>
    <p class="trakt-card-title ellipsis">{name}</p>
    <p class="trakt-card-subtitle ellipsis">
      {titleCount === 1
        ? m.text_today_titles_one()
        : m.text_today_titles_other({ count: titleCount })}
    </p>
  </CardFooter>
</TodayTile>
