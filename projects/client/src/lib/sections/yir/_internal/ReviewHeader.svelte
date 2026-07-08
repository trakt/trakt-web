<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { shortcut } from "@svelte-put/shortcut";
  import { map } from "rxjs";

  import { useShare } from "$lib/components/buttons/share/useShare";
  import { useQuery } from "$lib/features/query/useQuery";
  import { m } from "$lib/paraglide/messages";
  import { userProfileQuery } from "$lib/requests/queries/users/userProfileQuery";
  import { createArrowNavTriggers } from "$lib/utils/events/createArrowNavTriggers";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  import Link from "$lib/components/link/Link.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll";

  const {
    slug,
    prevUrl,
    nextUrl,
    canGoNext,
    title,
    subtitle,
    shareText,
    sourceId,
  }: {
    slug: string;
    prevUrl: string;
    nextUrl: string;
    canGoNext: boolean;
    title: string;
    subtitle?: string;
    shareText: string;
    sourceId: string;
  } = $props();

  const profileQuery = $derived(useQuery(userProfileQuery({ slug })));
  const profile = $derived(profileQuery.pipe(map(($q) => $q.data)));

  const { share } = $derived(useShare({ id: sourceId }));

  const shareData = $derived({
    title: shareText,
    text: shareText,
    url: browser ? page.url.toString() : "",
  });

  const canShare = $derived(
    browser && !!navigator.canShare && navigator.canShare(shareData),
  );
</script>

<svelte:window
  use:shortcut={{
    trigger: createArrowNavTriggers({
      prevUrl,
      nextUrl,
      canGoNext,
      goto,
    }),
  }}
/>

<header class="trakt-review-header" use:trackWindowScroll={"scrolled"}>
  <nav class="review-header-section review-header-center">
    <Link href={prevUrl} color="inherit" label={m.yir_button_previous()}>
      <CaretLeftIcon />
    </Link>
    <span class="review-header-label">
      <strong>{title}</strong>
      {#if subtitle}
        <span class="review-header-subtitle">{subtitle}</span>
      {/if}
    </span>
    {#if canGoNext}
      <Link href={nextUrl} color="inherit" label={m.yir_button_next()}>
        <CaretRightIcon />
      </Link>
    {:else}
      <span class="review-header-nav-btn disabled" aria-hidden="true">
        <CaretRightIcon />
      </span>
    {/if}
  </nav>

  {#if $profile}
    <div class="review-header-user">
      <UserAvatar
        user={{
          ...$profile,
          slug: $profile.slug ?? slug,
          isVip: $profile.isVip || $profile.isDirector,
        }}
        size="small"
      />
      <span class="review-header-username">
        <Link href={UrlBuilder.profile.user(slug)} color="inherit">
          {$profile.username}
        </Link>
      </span>
    </div>
  {/if}
  {#if canShare}
    <button
      class="review-header-share"
      onclick={() => share(shareData)}
      aria-label={m.button_label_share({ title: shareText })}
    >
      <ShareIcon />
    </button>
  {/if}
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-review-header {
    position: fixed;
    top: 0;
    inset-inline: 0;
    z-index: 10;

    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--gap-m);

    padding: var(--ni-20) var(--ni-10);
    padding-top: calc(var(--ni-20) + env(safe-area-inset-top, 0));

    background: transparent;
    color: var(
      --color-yir-header-foreground,
      var(--color-yir-poster-foreground)
    );

    transition:
      background-color 0.2s,
      backdrop-filter 0.2s;

    // The "scrolled" treatment also applies on hover so the bar lights up
    // when the user is interacting with it, even before they scroll.
    &:hover,
    &:global(.scrolled) {
      background: var(--color-background-mobile-navbar);
      box-shadow: var(--shadow-navbar);
      backdrop-filter: blur(var(--ni-8));

      color: var(--color-text-primary);

      :global(.review-header-nav-btn),
      :global(.review-header-center .trakt-link),
      :global(.review-header-user),
      :global(.review-header-share) {
        color: var(--color-text-primary);
      }
    }
  }

  .review-header-section {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-width: 0;
  }

  .review-header-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    gap: var(--gap-s);
  }

  // Nav buttons are <Link>s (their own component scope); the disabled variant
  // is a plain <span>. Style both.
  .review-header-nav-btn,
  .review-header-center :global(.trakt-link) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--ni-8);
    background: none;
    border: none;
    color: var(
      --color-yir-header-foreground,
      var(--color-yir-poster-foreground)
    );
    cursor: pointer;
    text-decoration: none;
    transition: color 0.2s;
  }

  .review-header-center :global(.trakt-link):hover {
    color: var(--color-yir-text-accent);
  }

  .review-header-nav-btn.disabled {
    opacity: 0.3;
    cursor: default;
  }

  .review-header-center :global(svg) {
    width: var(--ni-14);
    height: var(--ni-14);
  }

  .review-header-label {
    font-size: var(--font-size-text);
    letter-spacing: 2px;
    text-transform: uppercase;
    white-space: nowrap;

    strong {
      font-weight: 700;
    }
  }

  .review-header-user {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    color: var(
      --color-yir-header-foreground,
      var(--color-yir-poster-foreground)
    );
    text-decoration: none;
    min-width: 0;
  }

  .review-header-username {
    font-size: var(--font-size-text);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    overflow: hidden;
    text-overflow: ellipsis;

    // Inner <Link> renders in its own scope.
    :global(.trakt-link) {
      color: inherit;
      text-decoration: none;
    }
  }

  .review-header-share {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--ni-8);
    background: none;
    border: none;
    color: var(
      --color-yir-header-foreground,
      var(--color-yir-poster-foreground)
    );
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: var(--color-yir-text-accent);
    }

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  @include for-tablet-sm-and-below {
    .review-header-subtitle {
      display: none;
    }

    .review-header-username {
      display: none;
    }
  }

  @include for-mobile {
    .trakt-review-header {
      padding: var(--ni-8) var(--ni-12);
      padding-top: calc(var(--ni-8) + env(safe-area-inset-top, 0));
      gap: var(--gap-xs);
    }

    .review-header-user {
      margin-inline-end: auto;
    }
  }
</style>
