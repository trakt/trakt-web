<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import { map } from "rxjs";

  import { useShare } from "$lib/components/buttons/share/useShare";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useQuery } from "$lib/features/query/useQuery";
  import { m } from "$lib/paraglide/messages";
  import { userProfileQuery } from "$lib/requests/queries/users/userProfileQuery";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";

  const {
    slug,
    year,
  }: {
    slug: string;
    year: number;
  } = $props();

  const profileQuery = $derived(useQuery(userProfileQuery({ slug })));
  const profile = $derived(profileQuery.pipe(map(($q) => $q.data)));

  const currentYear = new Date().getFullYear();
  const isCurrentYear = $derived(year === currentYear);
  const canGoNext = $derived(year < currentYear);

  const periodLabel = $derived(
    isCurrentYear ? m.yir_title_year_to_date() : m.yir_title_year_in_review(),
  );

  const prevYearUrl = $derived(UrlBuilder.users(slug).yearToDate(year - 1));
  const nextYearUrl = $derived(UrlBuilder.users(slug).yearToDate(year + 1));

  const { share } = $derived(useShare({ id: "yir" }));

  const shareData = $derived({
    title: m.yir_share_text({ year }),
    text: m.yir_share_text({ year }),
    url: browser ? page.url.toString() : "",
  });

  const canShare = $derived(
    browser && !!navigator.canShare && navigator.canShare(shareData),
  );

  let isScrolled = $state(false);

  $effect(() => {
    if (!browser) return;
    const onScroll = () => {
      isScrolled = window.scrollY > 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });
</script>

<header class="yir-header" class:scrolled={isScrolled}>
  <nav class="yir-header-section yir-header-center">
    <a
      href={prevYearUrl}
      class="yir-header-nav-btn"
      aria-label={m.yir_button_previous()}
    >
      <CaretLeftIcon />
    </a>
    <span class="yir-header-year-label">
      <strong>{year}</strong>
      <span class="yir-header-period">{periodLabel}</span>
    </span>
    {#if canGoNext}
      <a
        href={nextYearUrl}
        class="yir-header-nav-btn"
        aria-label={m.yir_button_next()}
      >
        <CaretRightIcon />
      </a>
    {:else}
      <span class="yir-header-nav-btn disabled" aria-hidden="true">
        <CaretRightIcon />
      </span>
    {/if}
  </nav>

  {#if $profile && ($profile.isVip || $profile.isDirector)}
    <div class="yir-header-vip">
      <VipBadge isDirector={$profile.isDirector} />
    </div>
  {/if}
  {#if $profile}
    <a href="/users/{slug}" class="yir-header-user">
      <div class="yir-header-avatar">
        <CrossOriginImage src={$profile.avatar.url} alt="" />
      </div>
      <span class="yir-header-username">{$profile.username}</span>
    </a>
  {/if}
  {#if canShare}
    <button
      class="yir-header-share"
      onclick={() => share(shareData)}
      aria-label={m.button_label_share({ title: m.yir_share_text({ year }) })}
    >
      <ShareIcon />
    </button>
  {/if}
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;

    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--gap-m);

    padding: var(--ni-20) var(--ni-10);

    background: transparent;
    color: var(--shade-10);

    transition:
      background-color 0.2s,
      backdrop-filter 0.2s;

    &.scrolled {
      background: var(--color-background-mobile-navbar);
      box-shadow: var(--shadow-navbar);
      backdrop-filter: blur(var(--ni-8));
    }
  }

  .yir-header-section {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-width: 0;
  }

  .yir-header-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    gap: var(--gap-s);
  }

  .yir-header-nav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--ni-8);
    background: none;
    border: none;
    color: var(--shade-10);
    cursor: pointer;
    text-decoration: none;
    transition: color 0.2s;

    &:hover:not(.disabled) {
      color: var(--purple-300);
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

  .yir-header-year-label {
    font-size: 14px;
    letter-spacing: 2px;
    text-transform: uppercase;
    white-space: nowrap;

    strong {
      font-weight: 700;
    }
  }

  .yir-header-user {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    color: var(--shade-10);
    text-decoration: none;
    min-width: 0;
  }

  .yir-header-avatar {
    width: var(--ni-28);
    height: var(--ni-28);
    border-radius: 50%;
    overflow: hidden;
    background: var(--shade-800);
    flex-shrink: 0;

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .yir-header-username {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .yir-header-share {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--ni-8);
    background: none;
    border: none;
    color: var(--shade-10);
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: var(--purple-300);
    }

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  @include for-tablet-sm-and-below {
    .yir-header-period {
      display: none;
    }

    .yir-header-username {
      display: none;
    }
  }

  @include for-mobile {
    .yir-header {
      padding: var(--ni-8) var(--ni-12);
      gap: var(--gap-xs);
    }

    .yir-header-vip {
      display: none;
    }

    .yir-header-user {
      margin-right: auto;
    }
  }
</style>
