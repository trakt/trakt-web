<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { shortcut } from "@svelte-put/shortcut";
  import { map } from "rxjs";

  import { useShare } from "$lib/components/buttons/share/useShare";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { useQuery } from "$lib/features/query/useQuery";
  import { m } from "$lib/paraglide/messages";
  import { userProfileQuery } from "$lib/requests/queries/users/userProfileQuery";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import { trackWindowScroll } from "$lib/utils/actions/trackWindowScroll";

  const {
    slug,
    year,
    month,
  }: {
    slug: string;
    year: number;
    /** 1-12. */
    month: number;
  } = $props();

  const profileQuery = $derived(useQuery(userProfileQuery({ slug })));
  const profile = $derived(profileQuery.pipe(map(($q) => $q.data)));

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Step one month in either direction, rolling the year over at the bounds.
  const previous = $derived(
    month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 },
  );
  const next = $derived(
    month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 },
  );

  // Allow forward navigation up to (and including) the current month.
  const canGoNext = $derived(
    next.year < currentYear ||
      (next.year === currentYear && next.month <= currentMonth),
  );

  const monthName = $derived(
    toHumanMonth(new Date(year, month - 1, 1), languageTag()),
  );
  const periodLabel = $derived(`${monthName} ${year}`);
  const shareLabel = $derived(periodLabel);

  const prevUrl = $derived(
    UrlBuilder.users(slug).monthInReview(previous.year, previous.month),
  );
  const nextUrl = $derived(
    UrlBuilder.users(slug).monthInReview(next.year, next.month),
  );

  function isTextInputTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    const tag = target.tagName;
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      target.isContentEditable
    );
  }

  const { share } = $derived(useShare({ id: "mir" }));

  const shareData = $derived({
    title: m.mir_share_text({ month: shareLabel }),
    text: m.mir_share_text({ month: shareLabel }),
    url: browser ? page.url.toString() : "",
  });

  const canShare = $derived(
    browser && !!navigator.canShare && navigator.canShare(shareData),
  );
</script>

<svelte:window
  use:shortcut={{
    trigger: [
      {
        key: "ArrowLeft",
        modifier: false,
        // preventDefault is handled inside the callback so we don't hijack
        // cursor navigation while the user is typing in a text input.
        callback: ({ originalEvent }) => {
          if (isTextInputTarget(originalEvent.target)) return;
          originalEvent.preventDefault();
          goto(prevUrl);
        },
      },
      {
        key: "ArrowRight",
        modifier: false,
        enabled: canGoNext,
        callback: ({ originalEvent }) => {
          if (isTextInputTarget(originalEvent.target)) return;
          originalEvent.preventDefault();
          goto(nextUrl);
        },
      },
    ],
  }}
/>

<header class="trakt-mir-header" use:trackWindowScroll={"scrolled"}>
  <nav class="mir-header-section mir-header-center">
    <a
      href={prevUrl}
      class="mir-header-nav-btn"
      aria-label={m.yir_button_previous()}
    >
      <CaretLeftIcon />
    </a>
    <span class="mir-header-period-label">
      <strong>{periodLabel}</strong>
      <span class="mir-header-period">{m.mir_title_month_in_review()}</span>
    </span>
    {#if canGoNext}
      <a
        href={nextUrl}
        class="mir-header-nav-btn"
        aria-label={m.yir_button_next()}
      >
        <CaretRightIcon />
      </a>
    {:else}
      <span class="mir-header-nav-btn disabled" aria-hidden="true">
        <CaretRightIcon />
      </span>
    {/if}
  </nav>

  {#if $profile && ($profile.isVip || $profile.isDirector)}
    <div class="mir-header-vip">
      <VipBadge isDirector={$profile.isDirector} />
    </div>
  {/if}
  {#if $profile}
    <a href={UrlBuilder.profile.user(slug)} class="mir-header-user">
      <div class="mir-header-avatar">
        <CrossOriginImage src={$profile.avatar.url} alt="" />
      </div>
      <span class="mir-header-username">{$profile.username}</span>
    </a>
  {/if}
  {#if canShare}
    <button
      class="mir-header-share"
      onclick={() => share(shareData)}
      aria-label={m.button_label_share({ title: m.mir_share_text({
        month: shareLabel,
      }) })}
    >
      <ShareIcon />
    </button>
  {/if}
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mir-header {
    position: fixed;
    top: 0;
    inset-inline: 0;
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

    &:hover,
    &:global(.scrolled) {
      background: var(--color-background-mobile-navbar);
      box-shadow: var(--shadow-navbar);
      backdrop-filter: blur(var(--ni-8));

      color: var(--color-text-primary);

      :global(.mir-header-nav-btn),
      :global(.mir-header-user),
      :global(.mir-header-share) {
        color: var(--color-text-primary);
      }
    }
  }

  .mir-header-section {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-width: 0;
  }

  .mir-header-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    gap: var(--gap-s);
  }

  .mir-header-nav-btn {
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

  .mir-header-period-label {
    font-size: var(--font-size-text);
    letter-spacing: 2px;
    text-transform: uppercase;
    white-space: nowrap;

    strong {
      font-weight: 700;
    }
  }

  .mir-header-user {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    color: var(--shade-10);
    text-decoration: none;
    min-width: 0;
  }

  .mir-header-avatar {
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

  .mir-header-username {
    font-size: var(--font-size-text);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mir-header-share {
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
    .mir-header-period {
      display: none;
    }

    .mir-header-username {
      display: none;
    }
  }

  @include for-mobile {
    .trakt-mir-header {
      padding: var(--ni-8) var(--ni-12);
      gap: var(--gap-xs);
    }

    .mir-header-vip {
      display: none;
    }

    .mir-header-user {
      margin-inline-end: auto;
    }
  }
</style>
