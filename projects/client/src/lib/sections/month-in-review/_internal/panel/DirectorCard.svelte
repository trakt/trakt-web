<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const {
    director,
    year,
    month,
    monthName,
  }: {
    director: UserProfile;
    year: number;
    month: number;
    monthName: string;
  } = $props();

  const name = $derived(toDisplayableName(director));
  const href = $derived(
    UrlBuilder.users(director.slug ?? director.username).monthInReview(
      year,
      month,
    ),
  );
</script>

<Link
  {href}
  label={m.month_review_open_review({ name, month: monthName })}
  color="inherit"
  underline="none"
>
  <span class="trakt-month-review-director-card">
    <span class="bar"></span>
    <span class="meta bold">{m.mir_title_month_in_review()}</span>
    <span class="me">
      <img src={director.avatar.url} alt="" loading="lazy" />
      <span class="name">{name}</span>
      <span class="role bold">{m.month_review_role_director()}</span>
    </span>
    <span class="foot">
      <span class="month">{monthName}</span>
      <span class="open" aria-hidden="true"><CaretRightIcon /></span>
    </span>
  </span>
</Link>

<style>
  .trakt-month-review-director-card {
    display: flex;
    flex-direction: column;
    aspect-ratio: 5 / 7;
    border-radius: var(--border-radius-xl);
    overflow: hidden;
    container-type: inline-size;
    color: var(--color-text-primary);
    background:
      radial-gradient(
        90% 60% at 50% 30%,
        var(--color-month-review-glow),
        transparent 70%
      ),
      var(--color-month-review-card);
    box-shadow:
      inset 0 0 0 1px var(--color-month-review-hairline),
      var(--shadow-floating);
  }

  .bar {
    height: 3.5cqw;
    flex: none;
    background: var(--color-month-review-accent);
  }

  :global(.trakt-link:has(> .trakt-month-review-director-card)) {
    display: block;
    border-radius: var(--border-radius-xl);
  }

  :global(.trakt-link:focus-visible) > .trakt-month-review-director-card {
    outline: var(--ni-2) solid var(--color-month-review-accent);
    outline-offset: var(--ni-2);
  }

  .trakt-month-review-director-card .meta {
    padding: 6cqw 7cqw 0;
    white-space: nowrap;
    font-size: 4cqw;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .me {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2cqw;
    text-align: center;

    img {
      width: 34cqw;
      height: 34cqw;
      border-radius: 50%;
      object-fit: cover;
      box-shadow:
        0 0 0 1.5cqw var(--color-month-review-card),
        0 0 0 2.4cqw var(--color-month-review-accent);
    }
  }

  .meta,
  .name,
  .role,
  .month {
    line-height: 1.1;
  }

  .name {
    margin-top: 2cqw;
    font-size: 10cqw;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .trakt-month-review-director-card .role {
    font-size: 4cqw;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--color-month-review-accent);
  }

  .foot {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 3cqw;
    padding: 0 7cqw 7cqw;
  }

  .open {
    display: grid;
    place-items: center;
    flex: none;
    width: 11cqw;
    height: 11cqw;
    border-radius: 50%;
    background: var(--color-month-review-track);
    transition: background var(--transition-increment) ease-out;

    :global(svg) {
      width: 5cqw;
      height: 5cqw;
    }
  }

  .trakt-month-review-director-card:hover .open,
  :global(.trakt-link:focus-visible) .open {
    background: var(--color-month-review-accent);
    color: var(--shade-10);
  }

  .month {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13cqw;
    font-weight: 700;
    letter-spacing: -0.05em;
    line-height: 0.9;
  }
</style>
