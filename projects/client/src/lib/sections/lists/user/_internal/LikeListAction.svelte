<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LikeIcon from "$lib/components/icons/LikeIcon.svelte";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import { toLocaleNumber } from "$lib/utils/formatting/number/toLocaleNumber.ts";

  const {
    onToggle,
    disabled,
    state,
    list,
    style = "ghost",
  }: {
    onToggle: () => void;
    disabled: boolean;
    state: "liked" | "unliked";
    list: MediaListSummary;
    style?: "ghost" | "text";
  } = $props();

  const label = $derived(
    state === "liked"
      ? m.button_label_unlike_list({ name: list.name })
      : m.button_label_like_list({ name: list.name }),
  );
</script>

{#snippet likeIcon()}
  <LikeIcon style={state === "liked" ? "filled" : "open"} />
{/snippet}

<trakt-list-like-action data-style={style} data-state={state}>
  {#if style === "text"}
    <Button
      {label}
      size="tag"
      style="ghost"
      onclick={onToggle}
      {disabled}
      icon={likeIcon}
      --color-background-custom="transparent"
      --color-foreground-custom="var(--color-foreground)"
    >
      {toLocaleNumber(list.likeCount, languageTag())}
    </Button>
  {:else}
    <Button {label} style="ghost" onclick={onToggle} {disabled} icon={likeIcon}>
      {toLocaleNumber(list.likeCount, languageTag())}
    </Button>
  {/if}
</trakt-list-like-action>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-list-like-action {
    :global(.trakt-button) {
      gap: var(--gap-xs);
      flex-direction: row-reverse;
    }
  }

  trakt-list-like-action[data-style="text"] {
    :global(.trakt-button) {
      gap: var(--gap-xxs);
      margin: 0;
      padding: 0;
      min-width: unset;
      transform: none;
    }

    /* the ghost+tag combo draws a pill outline; only keep it as focus ring */
    :global(.trakt-button[data-style="ghost"][data-size="tag"]:not(:focus-visible)) {
      outline: none;
    }

    :global(.trakt-button[data-style="ghost"]:not([disabled])) {
      color: var(--color-text-secondary);
    }

    @include for-mouse {
      /* outmatches the ghost hover color + outline rules in Button.svelte */
      :global(
          .trakt-button[data-style="ghost"][data-size="tag"]:hover:not(
            [disabled]
          ):not([aria-disabled="true"]):not(:focus-visible)
        ) {
        color: var(--color-link-active);
        outline: none;
      }
    }

    :global(.trakt-button .button-label p) {
      font-weight: normal;
      font-size: var(--font-size-text-small);
    }

    :global(.trakt-button .button-icon svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }

  trakt-list-like-action[data-state="liked"] {
    :global(.trakt-button[data-style="ghost"]:not([disabled])) {
      color: var(--color-link-active);
    }
  }
</style>
