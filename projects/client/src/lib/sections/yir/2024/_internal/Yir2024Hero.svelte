<script lang="ts">
  import { map } from "rxjs";

  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { useQuery } from "$lib/features/query/useQuery";
  import { m } from "$lib/paraglide/messages";
  import type { YirDetail } from "$lib/requests/models/YirDetail";
  import { userProfileQuery } from "$lib/requests/queries/users/userProfileQuery";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { ReviewMode } from "../../ReviewMode";

  import Yir2024Membership from "./Yir2024Membership.svelte";
  import Yir2024PostersRow from "./Yir2024PostersRow.svelte";
  import Yir2024Stars from "./Yir2024Stars.svelte";

  const {
    slug,
    year,
    detail,
    isLoading = false,
    month = 1,
    mode = "yir",
  }: {
    slug: string;
    year: number;
    detail: YirDetail | null;
    isLoading?: boolean;
    /** 1-12. Only meaningful in MIR mode. */
    month?: number;
    mode?: ReviewMode;
  } = $props();

  const profileQuery = $derived(useQuery(userProfileQuery({ slug })));
  const profile = $derived(profileQuery.pipe(map(($q) => $q.data)));

  const now = new Date();
  const isCurrentYear = $derived(year === now.getFullYear());
  // MIR shows the month name as the huge label (lowercased by CSS); YIR keeps
  // the "year in review" / "year to date" wording.
  const hugeLabel = $derived(
    mode === "mir"
      ? toHumanMonth(new Date(year, month - 1, 1), languageTag())
      : isCurrentYear
        ? m.yir_2024_huge_label_year_to_date()
        : m.yir_2024_huge_label_year_in_review(),
  );

  // Posters need the YIR detail; render an empty list while it loads so the
  // rest of the hero (year row, label, directed-by, membership) paints
  // immediately and the posters fade in once the query lands.
  const heroPosters = $derived(
    detail
      ? [
          ...detail.mostWatched.shows.slice(0, 3),
          ...detail.mostWatched.movies.slice(0, 3),
        ].map((item) => item.entry)
      : [],
  );

  const displayName = $derived(
    $profile?.name.first ?? $profile?.name.full ?? $profile?.username ?? slug,
  );
  const joinYear = $derived($profile?.joinedAt?.getFullYear() ?? null);
</script>

<header class="trakt-yir-2024-hero">
  <div class="yir-2024-year-row">
    <Yir2024Stars />
    <span class="bold yir-2024-current-year">{year}</span>
    <Yir2024Stars />
  </div>

  <h1 class="yir-2024-huge-label" data-content={hugeLabel}>
    {hugeLabel}
  </h1>

  {#if $profile}
    <div class="yir-2024-directed-by">
      <div class="yir-2024-avatar-stack">
        <UserAvatar user={$profile} size="large" />
        {#if $profile.isVip || $profile.isDirector}
          <span class="yir-2024-vip">
            <VipBadge isDirector={$profile.isDirector} />
          </span>
        {/if}
      </div>
      <div class="yir-2024-directed-by-text">
        <p class="bold yir-2024-by-label bold">
          {m.yir_2024_directed_by()}
        </p>
        <p class="bold yir-2024-name-label bold">
          <Link href={UrlBuilder.profile.user(slug)} color="inherit">
            {displayName}
          </Link>
        </p>
      </div>
    </div>
  {/if}

  <div class="yir-2024-posters-membership">
    <Yir2024PostersRow entries={heroPosters} {isLoading} />
    <Yir2024Membership {joinYear} />
  </div>
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-2024-hero {
    position: relative;
    // Own stacking context so the z-index:-1 watermark below is scoped to this
    // element and can't slip behind the page background.
    isolation: isolate;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--gap-xl);

    // Stylized "trakt" wordmark + fanart cutout sits behind the hero text as a
    // watermark. Rendered on a ::before so its opacity is theme-driven (full
    // in dark, faint in light) without fading the hero's text, and so the page
    // background shows through instead of a flat veil rectangle.
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      background-image: url("/yir/2024/trakt-fanart-logo.svg");
      // Pushed down a bit so the "2024" stars row sits above it cleanly.
      background-position: center top var(--ni-72);
      background-repeat: no-repeat;
      background-size: contain;
      opacity: var(--yir-hero-watermark-opacity);
      pointer-events: none;
    }

    @include for-mobile {
      // Less vertical breathing between rows on small screens.
      gap: var(--gap-xs);

      // Pull the backdrop SVG up so it isn't hovering near the middle.
      &::before {
        background-position: center top;
      }
    }
  }

  .yir-2024-year-row {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    color: var(--color-yir-text-accent);
    text-transform: uppercase;
  }

  .yir-2024-current-year {
    font-size: var(--ni-52);
    color: var(--color-yir-text-accent);

    @include for-mobile {
      font-size: var(--ni-24);
    }
  }

  .yir-2024-huge-label {
    margin: 0;
    text-transform: lowercase;
    text-align: center;
    // Sized so "year in review" fits on a single line at every breakpoint.
    // ~10vw scales fluidly between the floor and the cap.
    font-size: clamp(var(--ni-44), 10.5vw, var(--ni-180));
    // line-height stays >= 1 so descenders ("y" in "year") render fully —
    // -webkit-text-fill-color: transparent clips below the baseline at
    // sub-1.0 line-heights.
    line-height: 1.1;
    letter-spacing: -0.04em;
    font-weight: 700;
    padding: 0 var(--ni-12);
    color: var(--color-yir-hero-gradient-end);
    white-space: nowrap;
    background: radial-gradient(
      59% 73% at 50% 119%,
      var(--color-yir-hero-gradient-start),
      var(--color-yir-hero-gradient-end)
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  // 2-column row: avatar (left) + stacked "Directed By" / name (right).
  // The wrapper is content-sized (inline-flex) so it stays centered as a
  // unit beneath the huge label.
  .yir-2024-directed-by {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: var(--gap-m);
    text-transform: uppercase;
    margin-top: var(--ni-8);

    // Mobile collapses the hero's row-gap to ni-8, so bump the directed-by
    // top-margin to give the avatar block visible breathing room from the
    // huge "year in review" label above.
    @include for-mobile {
      margin-top: var(--ni-32);
    }
  }

  .yir-2024-directed-by-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gap-xxs);
  }

  .yir-2024-by-label,
  .yir-2024-name-label {
    font-size: var(--font-size-title);
    text-align: start;

    @include for-mobile {
      font-size: var(--font-size-text);
    }
  }

  // "Directed By" matches the muted gray of the Trakt Worldwide / Member
  // Since labels; the username pops in the brighter shade-10.
  .yir-2024-by-label {
    color: var(--color-yir-text-secondary);
  }

  .yir-2024-name-label {
    color: var(--color-yir-text-primary);

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .yir-2024-avatar-stack {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;

    :global(.trakt-link) {
      display: flex;
    }

    :global(.trakt-user-avatar) {
      width: var(--ni-64);
      height: var(--ni-64);

      @include for-mobile {
        width: var(--ni-48);
        height: var(--ni-48);
      }
    }
  }

  .yir-2024-vip {
    position: absolute;
    bottom: var(--ni-neg-12);
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }

  .yir-2024-posters-membership {
    width: 100%;
    margin-top: var(--ni-16);
  }
</style>
