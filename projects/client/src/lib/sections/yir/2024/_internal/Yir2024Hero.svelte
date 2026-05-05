<script lang="ts">
  import { map } from "rxjs";

  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useQuery } from "$lib/features/query/useQuery";
  import { m } from "$lib/paraglide/messages";
  import type { YirDetail } from "$lib/requests/models/YirDetail";
  import { userProfileQuery } from "$lib/requests/queries/users/userProfileQuery";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  import Yir2024Membership from "./Yir2024Membership.svelte";
  import Yir2024PostersRow from "./Yir2024PostersRow.svelte";
  import Yir2024Stars from "./Yir2024Stars.svelte";

  const {
    slug,
    year,
    detail,
  }: {
    slug: string;
    year: number;
    detail: YirDetail;
  } = $props();

  const profileQuery = $derived(useQuery(userProfileQuery({ slug })));
  const profile = $derived(profileQuery.pipe(map(($q) => $q.data)));

  const now = new Date();
  const isCurrentYear = $derived(year === now.getFullYear());
  const hugeLabel = $derived(
    isCurrentYear
      ? m.yir_2024_huge_label_year_to_date()
      : m.yir_2024_huge_label_year_in_review(),
  );

  const heroPosters = $derived(
    [
      ...detail.mostWatched.shows.slice(0, 3),
      ...detail.mostWatched.movies.slice(0, 3),
    ].map((item) => item.entry),
  );

  const displayName = $derived(
    $profile?.name.first ?? $profile?.name.full ?? $profile?.username ?? slug,
  );
  const joinYear = $derived($profile?.joinedAt?.getFullYear() ?? null);
</script>

<header class="yir-2024-hero">
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
        <Link
          href={UrlBuilder.profile.user(slug)}
          color="inherit"
          label={displayName}
        >
          <span class="yir-2024-avatar">
            <CrossOriginImage src={$profile.avatar.url} alt="" />
          </span>
        </Link>
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
    <Yir2024PostersRow entries={heroPosters} />
    <Yir2024Membership {joinYear} />
  </div>
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-2024-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--gap-xl);
    // Stylized "trakt" wordmark + fanart cutout sits behind the hero text.
    // Pushed down a bit so the "2024" stars row sits above it cleanly.
    background-image: url("/yir/2024/trakt-fanart-logo.svg");
    background-position: center top var(--ni-72);
    background-repeat: no-repeat;
    background-size: contain;

    @include for-mobile {
      // Less vertical breathing between rows on small screens, and pull the
      // backdrop SVG up so it isn't hovering near the middle of the hero.
      gap: var(--gap-xs);
      background-position: center top;
    }
  }

  .yir-2024-year-row {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    color: var(--purple-300);
    text-transform: uppercase;
  }

  .yir-2024-current-year {
    font-size: var(--ni-52);
    color: var(--purple-300);

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
    color: var(--purple-700);
    white-space: nowrap;
    background: radial-gradient(
      59% 73% at 50% 119%,
      color-mix(in srgb, var(--purple-300) 80%, white),
      var(--purple-700)
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
    font-size: var(--ni-18);
    text-align: start;

    @include for-mobile {
      font-size: var(--ni-14);
    }
  }

  // "Directed By" matches the muted gray of the Trakt Worldwide / Member
  // Since labels; the username pops in the brighter shade-10.
  .yir-2024-by-label {
    color: var(--shade-300);
  }

  .yir-2024-name-label {
    color: var(--shade-10);

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .yir-2024-avatar-stack {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }

  .yir-2024-avatar {
    display: inline-flex;
    width: var(--ni-64);
    height: var(--ni-64);
    border-radius: 50%;
    border: var(--border-thickness-s) solid var(--shade-10);
    background: var(--shade-800);
    overflow: hidden;
    box-sizing: content-box;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @include for-mobile {
      width: var(--ni-48);
      height: var(--ni-48);
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
