<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { shortcut } from "@svelte-put/shortcut";
  import { map } from "rxjs";

  import { useShare } from "$lib/components/buttons/share/useShare";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useQuery } from "$lib/features/query/useQuery";
  import { m } from "$lib/paraglide/messages";
  import { userProfileQuery } from "$lib/requests/queries/users/userProfileQuery";
  import { createArrowNavTriggers } from "$lib/utils/events/createArrowNavTriggers";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
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

<header class="trakt-period-header" use:trackWindowScroll={"scrolled"}>
  <nav class="period-header-section period-header-center">
    <a
      href={prevUrl}
      class="period-header-nav-btn"
      aria-label={m.yir_button_previous()}
    >
      <CaretLeftIcon />
    </a>
    <span class="period-header-label">
      <strong>{title}</strong>
      {#if subtitle}
        <span class="period-header-subtitle">{subtitle}</span>
      {/if}
    </span>
    {#if canGoNext}
      <a
        href={nextUrl}
        class="period-header-nav-btn"
        aria-label={m.yir_button_next()}
      >
        <CaretRightIcon />
      </a>
    {:else}
      <span class="period-header-nav-btn disabled" aria-hidden="true">
        <CaretRightIcon />
      </span>
    {/if}
  </nav>

  {#if $profile && ($profile.isVip || $profile.isDirector)}
    <div class="period-header-vip">
      <VipBadge isDirector={$profile.isDirector} />
    </div>
  {/if}
  {#if $profile}
    <a href={UrlBuilder.profile.user(slug)} class="period-header-user">
      <div class="period-header-avatar">
        <CrossOriginImage src={$profile.avatar.url} alt="" />
      </div>
      <span class="period-header-username">{$profile.username}</span>
    </a>
  {/if}
  {#if canShare}
    <button
      class="period-header-share"
      onclick={() => share(shareData)}
      aria-label={m.button_label_share({ title: shareText })}
    >
      <ShareIcon />
    </button>
  {/if}
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-period-header {
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

      :global(.period-header-nav-btn),
      :global(.period-header-user),
      :global(.period-header-share) {
        color: var(--color-text-primary);
      }
    }
  }

  .period-header-section {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-width: 0;
  }

  .period-header-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    gap: var(--gap-s);
  }

  .period-header-nav-btn {
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

    &:hover:not(.disabled) {
      color: var(--color-yir-text-accent);
    }

    &.disabled {
      opacity: 0.3;
      cursor: default;
    }

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }

  .period-header-label {
    font-size: var(--font-size-text);
    letter-spacing: 2px;
    text-transform: uppercase;
    white-space: nowrap;

    strong {
      font-weight: 700;
    }
  }

  .period-header-user {
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

  .period-header-avatar {
    width: var(--ni-28);
    height: var(--ni-28);
    border-radius: 50%;
    overflow: hidden;
    background: var(--color-yir-surface-chip);
    flex-shrink: 0;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .period-header-username {
    font-size: var(--font-size-text);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .period-header-share {
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
    .period-header-subtitle {
      display: none;
    }

    .period-header-username {
      display: none;
    }
  }

  @include for-mobile {
    .trakt-period-header {
      padding: var(--ni-8) var(--ni-12);
      padding-top: calc(var(--ni-8) + env(safe-area-inset-top, 0));
      gap: var(--gap-xs);
    }

    .period-header-vip {
      display: none;
    }

    .period-header-user {
      margin-inline-end: auto;
    }
  }
</style>
