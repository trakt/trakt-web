<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import RetryIcon from "$lib/components/icons/RetryIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import BannerContainer from "../../_internal/BannerContainer.svelte";
  import type { SmartListUpgradeCardProps } from "./SmartListUpgradeCardProps.ts";

  const {
    variant,
    title,
    summary,
    detail,
    origin,
    onDismiss,
    actions,
  }: SmartListUpgradeCardProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  const note = $derived(
    $isMobile
      ? m.smart_list_upgrade_origin_note({ origin })
      : m.smart_list_upgrade_origin_note_link({ origin }),
  );
</script>

<BannerContainer variant="fluid">
  <section class="trakt-smart-list-upgrade-card" data-variant={variant}>
    <div class="upgrade-row">
      <span class="upgrade-icon" aria-hidden="true"><RetryIcon /></span>

      <div class="upgrade-copy">
        <p class="upgrade-headline">
          <span class="bold">{title}</span>
          {#if summary}
            <span class="secondary upgrade-separator" aria-hidden="true">
              &middot;
            </span>
            <span class="secondary">{summary}</span>
          {/if}
        </p>
        {#if detail}
          <p class="secondary upgrade-detail">{detail}</p>
        {/if}
      </div>

      <div class="upgrade-actions">
        <div class="upgrade-cta">
          {@render actions()}
        </div>
        {#if !$isMobile}
          <Button
            size="small"
            variant="secondary"
            color="default"
            type="button"
            label={m.button_text_not_now()}
            onclick={onDismiss}
          >
            {m.button_text_not_now()}
          </Button>
        {/if}
      </div>

      {#if $isMobile}
        <div class="upgrade-close">
          <ActionButton
            onclick={onDismiss}
            label={m.button_text_not_now()}
            size="small"
            style="ghost"
          >
            <CloseIcon />
          </ActionButton>
        </div>
      {/if}
    </div>

    <p class="secondary upgrade-note">{note}</p>
  </section>
</BannerContainer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-smart-list-upgrade-card {
    position: relative;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    width: 100%;
    box-sizing: border-box;

    padding: var(--gap-m) var(--gap-l);

    background: color-mix(
      in srgb,
      var(--color-card-background) 80%,
      transparent
    );
    border-radius: var(--border-radius-xl);
    box-shadow: var(--shadow-floating);

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;

      background: radial-gradient(
        85% 130% at 100% 0%,
        color-mix(in srgb, var(--purple-500) 12%, transparent),
        transparent 60%
      );
    }

    > * {
      position: relative;
    }

    @include for-mobile {
      padding: var(--gap-m);
    }
  }

  .upgrade-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-m);

    @include for-mobile {
      position: relative;
      flex-direction: column;
      align-items: stretch;
      gap: var(--gap-s);
    }
  }

  .upgrade-icon {
    flex-shrink: 0;

    display: grid;
    place-items: center;

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }

    @include for-mobile {
      display: none;
    }
  }

  .upgrade-copy {
    flex: 1 1 var(--ni-320);
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);

    @include for-mobile {
      flex-basis: auto;
      padding-inline-end: var(--ni-40);
    }
  }

  .upgrade-headline {
    @include for-mobile {
      display: flex;
      flex-direction: column;
    }
  }

  .upgrade-separator {
    @include for-mobile {
      display: none;
    }
  }

  .upgrade-detail {
    font-size: var(--font-size-tag);
  }

  .upgrade-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    @include for-mobile {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .upgrade-cta {
    display: contents;

    :global(.trakt-button) {
      justify-content: center;
      gap: var(--gap-xs);
    }

    @include for-mobile {
      :global(.trakt-button) {
        --button-height: var(--ni-44);
        width: 100%;
        box-sizing: border-box;
      }
    }
  }

  .upgrade-close {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
  }

  .upgrade-note {
    font-size: var(--font-size-tag);
  }
</style>
