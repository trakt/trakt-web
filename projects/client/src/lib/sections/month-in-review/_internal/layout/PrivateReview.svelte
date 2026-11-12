<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const {
    name,
    year,
    month,
    monthName,
    canSeeOwn,
  }: {
    name: string;
    year: number;
    month: number;
    monthName: string;
    canSeeOwn: boolean;
  } = $props();
</script>

<div class="trakt-month-review-private">
  <span class="icon" aria-hidden="true"><LockIcon /></span>
  <h2>{m.month_review_private_title({ name, month: monthName })}</h2>
  <p>{m.month_review_private_body()}</p>
  {#if canSeeOwn}
    <Button
      href={UrlBuilder.users("me").monthInReview(year, month)}
      label={m.month_review_private_own({ month: monthName })}
      color="purple"
    >
      {m.month_review_private_own({ month: monthName })}
    </Button>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-review-private {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-m);
    padding: var(--ni-56) var(--gap-l);
    border-radius: var(--border-radius-xxl);
    text-align: center;
    background:
      radial-gradient(
        60% 80% at 50% 0%,
        var(--color-month-review-panel-glow),
        transparent 70%
      ),
      var(--color-month-review-panel);
    box-shadow: inset 0 0 0 1px
      color-mix(in srgb, var(--color-month-review-accent) 35%, transparent);

    h2 {
      margin: 0;
      max-width: 22ch;
      font-size: clamp(var(--ni-28), 4vw, var(--ni-44));
      letter-spacing: -0.03em;
      line-height: 1.05;
      text-wrap: balance;
    }

    p {
      margin: 0;
      max-width: 46ch;
      color: var(--color-text-secondary);
    }

    @include for-mobile {
      padding: var(--ni-40) var(--gap-m);
    }
  }

  .icon {
    display: grid;
    place-items: center;
    width: var(--ni-48);
    height: var(--ni-48);
    border-radius: 50%;
    color: var(--color-month-review-accent);
    background: color-mix(
      in srgb,
      var(--color-month-review-accent) 14%,
      transparent
    );

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }
</style>
