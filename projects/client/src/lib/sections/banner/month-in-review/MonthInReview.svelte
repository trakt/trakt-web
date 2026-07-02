<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import DismissButton from "../_internal/DismissButton.svelte";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const { month, onDismiss }: { month: Date; onDismiss: () => void } = $props();
  const { user } = useUser();

  const monthName = $derived(toHumanMonth(month, languageTag()));
  const href = $derived(
    UrlBuilder.users($user.slug).monthInReview(
      month.getFullYear(),
      month.getMonth() + 1,
    ),
  );
</script>

<div class="trakt-month-in-review">
  <div class="mir-pill">
    <span class="mir-month bold ellipsis">{monthName}</span>
    <span class="mir-in-review">{m.mir_banner_in_review()}</span>
  </div>

  <p class="mir-body ellipsis">{m.mir_banner_body({ month: monthName })}</p>

  <div class="mir-actions">
    <a class="mir-explore bold" {href}>{m.mir_banner_explore()}</a>
    <DismissButton {onDismiss} />
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-in-review {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    padding: var(--gap-xxs);
    padding-inline-end: var(--gap-m);
    background: var(--color-review-base);
    border-radius: 9999px;
    width: 80%;
    min-width: 0;
    overflow: hidden;
  }

  .mir-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--purple-600);
    border-radius: 9999px;
    padding: var(--gap-xs) var(--gap-l);
    flex-shrink: 0;
    overflow: hidden;
    max-width: 14ch;
  }

  .mir-month {
    font-size: var(--font-size-title);
    color: var(--color-review-foreground);
    max-width: 100%;
  }

  .mir-in-review {
    font-size: var(--font-size-text-small);
    color: var(--color-review-foreground);
    opacity: 0.8;
    white-space: nowrap;
  }

  .mir-body {
    flex: 1 1 0;
    min-width: 0;
    font-size: var(--font-size-text);
    color: var(--color-review-foreground);
    text-align: center;
  }

  .mir-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-l);
    flex-shrink: 0;
    margin-inline-start: auto;
  }

  .mir-explore {
    display: flex;
    align-items: center;
    gap: var(--gap-l);
    color: var(--color-review-accent);
    text-decoration: none;
    font-size: var(--font-size-text);
    white-space: nowrap;

    &::before {
      content: '';
      display: block;
      width: 1px;
      height: var(--ni-16);
      background: var(--color-review-foreground);
      opacity: 0.3;
    }

    &:hover {
      text-decoration: underline;
    }
  }
</style>
