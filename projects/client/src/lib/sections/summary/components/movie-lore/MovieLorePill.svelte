<script lang="ts">
  import AvatarPill from "$lib/components/avatar-pill/AvatarPill.svelte";
  import AvatarPillSkeleton from "$lib/components/avatar-pill/AvatarPillSkeleton.svelte";
  import BookIcon from "$lib/components/icons/BookIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { toEarlierFilmsLabel } from "./toEarlierFilmsLabel.ts";
  import { useMovieLore } from "./useMovieLore.ts";

  const { movie }: { movie: Pick<MovieEntry, "slug" | "title"> } = $props();

  const { lore } = useMovieLore(fromRune(() => ({ slug: movie.slug })));

  const { buildDrawerLink } = summaryDrawerNavigation();
  const drawerLink = $derived(buildDrawerLink(SummaryDrawers.MovieLore));

  const earlierCount = $derived($lore?.earlier.length ?? 0);
</script>

{#snippet icon()}
  <BookIcon />
{/snippet}

{#if $lore === undefined}
  <AvatarPillSkeleton countWidth="12ch" labelWidth="8ch" />
{:else if $lore}
  <AvatarPill
    avatars={[]}
    countLabel={earlierCount > 0 ? m.button_text_before_you_watch() : null}
    label={earlierCount > 0
      ? toEarlierFilmsLabel(earlierCount)
      : m.button_text_before_you_watch()}
    ariaLabel={m.button_label_open_movie_lore({ title: movie.title })}
    href={drawerLink.href}
    noscroll={drawerLink.noscroll}
    replacestate={drawerLink.replacestate}
    {icon}
  />
{/if}
