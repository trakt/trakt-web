<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { WatchingNowEntry } from "../models/WatchingNowEntry.ts";
  import { toWatchingTitles } from "./toWatchingTitles.ts";
  import WatchingNowProgress from "./WatchingNowProgress.svelte";

  const {
    entry,
    withTitle = false,
    onclick,
  }: {
    entry: WatchingNowEntry;
    withTitle?: boolean;
    onclick?: () => void;
  } = $props();

  const name = $derived(toDisplayableName(entry.user));
  const caption = $derived.by(() => {
    const { title, subtitle } = toWatchingTitles(entry.nowPlaying);
    return [withTitle ? title : null, subtitle]
      .filter((part) => part != null)
      .join(" · ");
  });
  const profileHref = $derived(
    entry.user.slug == null
      ? undefined
      : UrlBuilder.profile.user(entry.user.slug),
  );
</script>

<li class="trakt-watching-now-person-row">
  <Link href={profileHref} color="inherit" {onclick}>
    <div class="person-row-grid">
      <UserAvatar user={entry.user} linked={false} />

      <div class="person-row-copy">
        <p class="trakt-card-title ellipsis bold">{name}</p>
        {#if caption}
          <span class="small secondary ellipsis">{caption}</span>
        {/if}
        <WatchingNowProgress nowPlaying={entry.nowPlaying} />
      </div>
    </div>
  </Link>
</li>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-watching-now-person-row {
    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--color-foreground) 5%, transparent);

    transition: background-color var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
      }
    }

    :global(.trakt-link) {
      display: block;
      text-decoration: none;
      border-radius: inherit;
    }

    .person-row-grid {
      display: grid;
      grid-template-columns: var(--ni-44) minmax(0, 1fr);
      align-items: center;
      gap: var(--gap-s);

      padding: var(--gap-xs) var(--gap-s);
    }

    .person-row-copy {
      display: flex;
      flex-direction: column;
      gap: var(--ni-4);
      min-width: 0;
    }
  }
</style>
