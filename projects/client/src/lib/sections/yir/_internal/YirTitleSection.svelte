<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useQuery } from "$lib/features/query/useQuery";
  import { m } from "$lib/paraglide/messages";
  import type { YirYear } from "$lib/requests/models/YirYear";
  import { userProfileQuery } from "$lib/requests/queries/users/userProfileQuery";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import { toLoadingState } from "$lib/utils/requests/toLoadingState";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { map } from "rxjs";

  const {
    slug,
    year,
    subtitleOverride,
  }: {
    slug: string;
    year: YirYear;
    /** Replaces the computed subtitle (e.g. the all-time year range). */
    subtitleOverride?: string;
  } = $props();

  const profileQuery = $derived(useQuery(userProfileQuery({ slug })));
  const profile = $derived(profileQuery.pipe(map(($q) => $q.data)));

  const now = new Date();
  const isAllTime = $derived(year === "all");
  const isCurrentYear = $derived(year === now.getFullYear());
  const subtitle = $derived(
    subtitleOverride ??
      (isAllTime
        ? m.yir_subtitle_all_time()
        : isCurrentYear
          ? m.yir_title_year_to_date()
          : m.yir_title_year_in_review()),
  );

  const isProfilePending = $derived(
    profileQuery.pipe(map(($q) => toLoadingState($q))),
  );

  const hasGradient = $derived(!$isProfilePending && !$profile?.cover?.url);
  const coverSrc = $derived($profile?.cover?.url);
</script>

<section class="trakt-yir-title-section" class:is-all-time={isAllTime}>
  <div class="yir-cover-bg" class:has-gradient={hasGradient}>
    {#if coverSrc}
      <CrossOriginImage src={coverSrc} alt="" />
    {/if}
  </div>
  <div class="yir-titles-wrapper">
    <div class="yir-titles">
      {#if $profile}
        <div class="yir-user">
          <span class="yir-avatar-link">
            <UserAvatar user={$profile} size="large" />
          </span>
          <span class="yir-display-name">
            <Link href={UrlBuilder.profile.user(slug)} color="inherit">
              {$profile.name.full || $profile.username}
            </Link>
          </span>
        </div>
        <div class="yir-under-user"></div>
      {/if}

      <h1 class="yir-year" class:is-text={isAllTime}>
        {isAllTime ? m.yir_label_all_time() : year}
      </h1>
      <h2 class="yir-subtitle">{subtitle}</h2>
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-title-section {
    // Poster hero: cover image + dark panel + white text in both themes.
    // Pin the shared chrome tokens (consumed by YirSectionHeader and the
    // text below) to their always-dark poster values so the overlay stays
    // legible regardless of the active theme.
    --color-yir-text-primary: var(--color-yir-poster-foreground);
    --color-yir-border: var(--color-yir-poster-foreground);
    --color-yir-title-chip-background: var(--color-yir-scrim);

    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    min-height: 100dvh;
    background-color: var(--color-yir-poster-background);
    color: var(--color-yir-poster-foreground);
    position: relative;
    overflow: hidden;
  }

  .yir-cover-bg {
    position: absolute;
    inset: 0;

    // When explicitly set (no cover, not loading): gradient background.
    &.has-gradient {
      background:
        radial-gradient(
          ellipse 70% 65% at 25% 52%,
          var(--purple-700) 0%,
          transparent 65%
        ),
        radial-gradient(
          ellipse 50% 45% at 72% 50%,
          var(--blue-800) 0%,
          transparent 65%
        ),
        var(--color-yir-poster-background);
    }

    // When a cover image is present, render it and add the top scrim.
    &:not(.has-gradient) {
      // Own stacking context so the top scrim below can layer above the image
      // (the image is a stacking context via `contain`, so a plain positioned
      // ::before would otherwise paint under it). Stays below the titles.
      isolation: isolate;

      :global(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }

      // The fixed header's text is always light on this template, so darken
      // the top of the cover behind it (fading to transparent) to keep it
      // readable over bright posters.
      &::before {
        content: "";
        position: absolute;
        inset-block-start: 0;
        inset-inline: 0;
        z-index: var(--layer-base);
        height: var(--ni-160);
        background: linear-gradient(
          to bottom,
          color-mix(in srgb, var(--shade-1000) 60%, transparent),
          transparent
        );
        pointer-events: none;
      }
    }
  }

  .yir-titles-wrapper {
    width: 100%;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .yir-titles {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    background: radial-gradient(
      circle,
      var(--color-yir-poster-surface-raised) 20%,
      var(--color-yir-poster-background) 80%
    );
    padding-inline: var(--ni-20);
    padding-block: calc(var(--ni-20) * 1.3);
    border-radius: var(--border-radius-l);
    box-shadow: 0 0 var(--ni-52) var(--color-yir-poster-surface);

    @include for-mobile {
      max-width: 80%;
    }
  }

  .yir-user {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-10);
  }

  .yir-avatar-link {
    display: flex;
    flex-shrink: 0;

    :global(.trakt-link) {
      display: flex;
      text-decoration: none;
    }

    :global(.trakt-user-avatar) {
      width: var(--ni-40);
      height: var(--ni-40);

      @include for-mobile {
        width: var(--ni-30);
        height: var(--ni-30);
      }
    }
  }

  .yir-display-name {
    display: inline-block;
    font-size: var(--ni-24);

    :global(.trakt-link) {
      color: var(--color-yir-poster-foreground);
      text-decoration: none;
    }

    @include for-mobile {
      font-size: var(--ni-20);
    }
  }

  .yir-under-user {
    width: var(--ni-380);
    max-width: 100%;
    border-bottom: var(--border-thickness-xxs) dashed
      var(--color-yir-text-muted);
    margin: var(--ni-24) auto var(--ni-6) auto;

    @include for-mobile {
      width: var(--ni-256);
    }
  }

  .yir-year {
    font-size: calc(var(--ni-180) * 0.7);
    font-weight: bold;
    margin: 0;
    line-height: 1;
    color: var(--color-yir-poster-foreground);

    @include for-mobile {
      font-size: calc(var(--ni-104) * 0.7);
    }

    // The all-time view shows a word ("All Time") instead of a 4-digit year,
    // so it needs a smaller size to avoid wrapping/overflow.
    &.is-text {
      font-size: var(--ni-104);

      @include for-mobile {
        font-size: var(--ni-60);
      }
    }
  }

  .yir-subtitle {
    background-color: transparent;
    color: var(--color-yir-poster-foreground);
    border: var(--border-thickness-xs) solid var(--color-yir-border);
    border-radius: var(--border-radius-l);
    display: block;
    width: 70%;
    text-transform: uppercase;
    padding: var(--ni-8) var(--ni-16);
    letter-spacing: 3px;
    word-spacing: 5px;
    margin: 0;
    text-align: center;
    font-size: var(--ni-18);
    font-weight: normal;
    line-height: 1;
  }

  // All-time hero matches the v2 cover: the title sits directly on the fanart
  // (no dark box / divider / pill), with a heavier weight and plain-white
  // subtitle. Text-shadow keeps everything legible without a scrim.
  .is-all-time {
    // Large soft radial scrim centered behind the title — darkens the middle
    // for legibility while the fanart stays vivid toward the edges.
    .yir-cover-bg::after {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse at center,
        color-mix(in srgb, var(--shade-1000) 62%, transparent) 0%,
        color-mix(in srgb, var(--shade-1000) 28%, transparent) 45%,
        transparent 72%
      );
    }

    // No dark box / divider — the title sits directly on the fanart.
    .yir-titles {
      background: none;
      box-shadow: none;
      padding: 0;
    }

    .yir-under-user {
      display: none;
    }

    .yir-user {
      margin-bottom: var(--ni-12);
    }

    .yir-display-name {
      font-size: var(--ni-24);

      @include for-mobile {
        font-size: var(--ni-20);
      }
    }

    .yir-display-name :global(.trakt-link),
    .yir-year,
    .yir-subtitle {
      text-shadow: 0 var(--ni-2) var(--ni-16)
        color-mix(in srgb, var(--shade-1000) 30%, transparent);
    }

    .yir-year {
      font-size: clamp(var(--ni-52), 10vw, var(--ni-128));
      letter-spacing: -1px;
    }

    .yir-subtitle {
      background: none;
      border: none;
      color: var(--shade-10);
      padding: 0;
      width: auto;
      margin-top: var(--ni-12);
      font-size: var(--ni-28);
      letter-spacing: 2px;

      @include for-mobile {
        font-size: var(--ni-18);
      }
    }
  }
</style>
