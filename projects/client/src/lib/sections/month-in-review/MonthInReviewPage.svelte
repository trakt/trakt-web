<script lang="ts">
  import { page } from "$app/state";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery";
  import { userProfileQuery } from "$lib/requests/queries/users/userProfileQuery";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { toLoadingState } from "$lib/utils/requests/toLoadingState.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { map } from "rxjs";
  import { useFreeMonthReview } from "./_internal/data/useFreeMonthReview.ts";
  import { useVipMonthReview } from "./_internal/data/useVipMonthReview.ts";
  import LedgerSection from "./_internal/layout/LedgerSection.svelte";
  import ReviewHero from "./_internal/layout/ReviewHero.svelte";
  import ReviewOutro from "./_internal/layout/ReviewOutro.svelte";
  import PrivateReview from "$lib/sections/review/PrivateReview.svelte";
  import ReviewTopBar from "./_internal/layout/ReviewTopBar.svelte";
  import SectionSkeleton from "./_internal/layout/SectionSkeleton.svelte";
  import Stat from "./_internal/layout/Stat.svelte";
  import VipPanel from "$lib/sections/review/VipPanel.svelte";
  import BookendsSection from "./_internal/sections/BookendsSection.svelte";
  import NumbersSection from "./_internal/sections/NumbersSection.svelte";
  import RatingsSection from "./_internal/sections/RatingsSection.svelte";
  import WatchedSection from "./_internal/sections/WatchedSection.svelte";
  import ServicesSection from "./_internal/sections/ServicesSection.svelte";
  import TypeSection from "./_internal/sections/TypeSection.svelte";

  const {
    slug,
    year,
    month,
  }: {
    slug: string;
    year: number;
    month: number;
  } = $props();

  const { user } = useUser();
  const { isAuthorized } = useAuth();
  const { isMe } = $derived(useIsMe(slug));
  const profileQuery = useQuery(
    fromRune(() => slug).pipe(
      map(($slug) => userProfileQuery({ slug: $slug })),
    ),
  );
  const profile = profileQuery.pipe(map(($query) => $query.data));
  const isProfileLoading = profileQuery.pipe(map(toLoadingState));

  const canBeVip = $derived(
    $isMe
      ? Boolean($user?.isVip)
      : Boolean($profile?.isVip || $profile?.isDirector),
  );
  const isVipShaped = $derived(!$isMe || canBeVip);
  const loadingStatLabels = $derived([
    m.month_review_label_plays(),
    m.month_review_label_movies(),
    m.month_review_label_shows(),
    m.month_review_label_active_days(),
    ...(isVipShaped ? [m.month_review_label_hours()] : []),
  ]);
  const { review: vipReview, isLoading: isVipLoading } = useVipMonthReview(
    fromRune(() => ({
      slug,
      year,
      month,
      isEnabled: canBeVip,
      withRatings: $isMe,
    })),
  );

  const needsFree = $derived(
    $isMe && (!canBeVip || (!$isVipLoading && !$vipReview)),
  );
  const { review: freeReview, isLoading: isFreeLoading } = useFreeMonthReview(
    fromRune(() => ({
      slug,
      year,
      month,
      isEnabled: needsFree,
      withRatings: $isMe,
    })),
  );

  const isResolvingOwner = $derived($isAuthorized && !$user);
  const isLoading = $derived(
    isResolvingOwner ||
      (!$isMe && $isProfileLoading) ||
      (canBeVip && $isVipLoading) ||
      (needsFree && $isFreeLoading),
  );
  const review = $derived(isLoading ? null : ($vipReview ?? $freeReview));
  const isPrivate = $derived(!$isMe && !isLoading && !review && !!$profile);

  const shareUrl = $derived(
    $profile?.slug
      ? `${page.url.origin}${UrlBuilder.users($profile.slug).monthInReview(year, month)}`
      : undefined,
  );
  const canShare = $derived(
    canBeVip && Boolean(shareUrl) && review?.tier !== "free" && !isPrivate,
  );

  const { track: trackView } = useTrack(AnalyticsEvent.MonthReviewView);
  let lastTrackedView: string | undefined;

  $effect(() => {
    if (!review) return;

    const period = `${slug}/${year}/${month}`;
    if (lastTrackedView === period) return;

    lastTrackedView = period;
    trackView({ tier: review.tier, owner: $isMe ? "me" : "other" });
  });

  const subtitle = $derived(
    $isMe || !$profile
      ? m.month_review_subtitle_me()
      : m.month_review_subtitle_user({ name: toDisplayableName($profile) }),
  );

  const monthName = $derived(
    toHumanMonth(new Date(year, month - 1, 1), languageTag()),
  );
  const previousMonthName = $derived(
    toHumanMonth(new Date(year, month - 2, 1), languageTag()),
  );
</script>

<div class="trakt-month-review" data-sveltekit-preload-code="hover">
  <div class="content">
    <ReviewTopBar {slug} {year} {month}>
      {#snippet who()}
        {#if $profile}
          <UserAvatar user={$profile} size="small" />
          <span class="who-text">
            <span class="who-name ellipsis bold"
              >{toDisplayableName($profile)}</span
            >
            <span class="who-label bold">{m.mir_title_month_in_review()}</span>
          </span>
        {/if}
      {/snippet}
      {#snippet actions()}
        {#if canShare}
          <ShareButton
            title={m.mir_share_text({ month: `${monthName} ${year}` })}
            urlOverride={shareUrl}
            source={{ id: "mir" }}
          />
        {/if}
      {/snippet}
    </ReviewTopBar>

    <ReviewHero
      {year}
      {month}
      {subtitle}
      {isLoading}
      scrollIntro={review ? review.tier === "vip" : isVipShaped}
      titles={review?.titles ?? []}
    >
      {#snippet stats()}
        {#if review}
          <Stat value={review.plays} label={m.month_review_label_plays()} />
          <Stat value={review.movies} label={m.month_review_label_movies()} />
          <Stat value={review.shows} label={m.month_review_label_shows()} />
          {#if review.activeDays !== undefined}
            <Stat
              value={review.activeDays}
              label={m.month_review_label_active_days()}
            />
          {/if}
          {#if review.minutes !== undefined}
            <Stat
              value={Math.round(review.minutes / 60)}
              label={m.month_review_label_hours()}
            />
          {/if}
        {:else if isLoading}
          {#each loadingStatLabels as label, index (index)}
            <Stat value={null} {label} />
          {/each}
        {/if}
      {/snippet}
    </ReviewHero>

    <main class="ledger">
      {#if isLoading}
        <SectionSkeleton />
        <SectionSkeleton />
      {/if}

      {#if isPrivate && $profile}
        <PrivateReview
          name={toDisplayableName($profile)}
          {year}
          {month}
          periodName={monthName}
          canSeeOwn={Boolean($user?.slug)}
          isPrivateProfile={$profile.private}
        />
      {/if}

      {#if review && review.plays === 0}
        <p class="empty">{m.month_review_empty({ month: monthName })}</p>
      {/if}

      {#if review?.tier === "vip" && review.plays > 0}
        <NumbersSection {review} {year} {month} {previousMonthName} />
        {#if review.byType}
          <TypeSection
            label={m.month_review_label_shows()}
            stats={review.byType.shows}
            totalPlays={review.plays}
            {year}
            {month}
          />
          <TypeSection
            label={m.month_review_label_movies()}
            stats={review.byType.movies}
            totalPlays={review.plays}
            {year}
            {month}
          />
        {/if}
        <ServicesSection {review} {previousMonthName} />
        <RatingsSection {review} />
        <BookendsSection {review} />
      {:else if review && review.titles.length > 0}
        <WatchedSection {review} />
      {/if}

      {#if review?.tier === "free" && $isMe}
        <LedgerSection
          label={m.month_review_section_more({ month: monthName })}
        >
          <VipPanel {year} {month} periodName={monthName} />
        </LedgerSection>
      {/if}

      <ReviewOutro {slug} {year} {month} showYear={review?.tier === "vip"} />
    </main>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-review {
    width: 100%;
    overflow-x: clip;
  }

  .content {
    width: 100%;
    max-width: var(--ni-1280);
    margin-inline: auto;
    box-sizing: border-box;
    padding-inline: max(
      var(--layout-distance-side),
      var(--layout-sidebar-distance)
    );

    @include for-desktop {
      padding-inline-start: calc(var(--layout-sidebar-distance) + var(--ni-32));
    }
    padding-bottom: var(--ni-120);
  }

  .who-text {
    display: flex;
    flex-direction: column;
    min-width: 0;

    @include for-tablet-sm-and-below {
      display: none;
    }
  }

  .who-label {
    font-size: var(--font-size-text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-secondary);

    @include for-tablet-lg {
      display: none;
    }
  }

  .ledger {
    display: flex;
    flex-direction: column;
    gap: var(--ni-72);
  }

  .empty {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--font-size-title);
  }
</style>
