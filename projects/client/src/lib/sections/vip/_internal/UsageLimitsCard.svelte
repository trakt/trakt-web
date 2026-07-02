<script lang="ts">
  import MoreButton from "$lib/components/buttons/more/MoreButton.svelte";
  import { MoreButtonIntlProvider } from "$lib/components/buttons/more/MoreButtonIntlProvider";
  import * as m from "$lib/features/i18n/messages";
  import UsageLimitItem from "../UsageLimitItem.svelte";
  import type { UsageCategoryItem } from "./utils/mapToUsageCategories";

  const {
    title,
    items,
    variant = "vip",
    isLoading = false,
    style = "default",
  }: {
    title?: string;
    items: UsageCategoryItem[];
    variant?: "free" | "vip";
    isLoading?: boolean;
    style?: "default" | "compact";
  } = $props();

  let isExpanded = $state(false);
  const displayableItems = $derived(
    isExpanded || variant === "vip" ? items : items.slice(0, 3),
  );
</script>

<div class="trakt-usage-limits-card" data-variant={variant} data-style={style}>
  {#if title}
    <span class="secondary bold">{title}</span>
  {/if}

  <div class="trakt-usage-limits">
    {#each displayableItems as item}
      <UsageLimitItem {item} {variant} {isLoading} />
    {/each}
  </div>

  {#if variant === "free"}
    <div class="trakt-usage-limits-footer">
      <MoreButton
        i18n={MoreButtonIntlProvider}
        label={m.button_label_see_more_limits()}
        count={undefined}
        onCollapse={() => (isExpanded = false)}
        onExpand={() => (isExpanded = true)}
      />
      <p class="secondary italic">
        The dashed areas show your potential with VIP
      </p>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-usage-limits-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    transition: padding var(--transition-increment) ease-in-out;

    &[data-style="default"] {
      background: var(--background-usage-limits-card);

      box-shadow: var(--shadow-base);

      padding: var(--ni-32);
      box-sizing: border-box;

      border-radius: var(--border-radius-xxl);
      border: var(--ni-1) solid
        color-mix(in srgb, var(--color-border) 50%, transparent);
    }

    &[data-variant="free"] {
      border: none;
      box-shadow: none;
      background: none;
      padding: 0;
    }

    @include for-mobile {
      &[data-style="default"] {
        padding: var(--ni-18);
      }
    }
  }

  .trakt-usage-limits {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .trakt-usage-limits-footer {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    justify-content: space-between;
  }
</style>
