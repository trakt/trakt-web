<script lang="ts">
  import LaurelIcon from "$lib/components/icons/LaurelIcon.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import * as m from "$lib/features/i18n/messages";

  const {
    won,
    variant = "cover",
  }: { won: boolean | null; variant?: "cover" | "inline" } = $props();

  const state = $derived(
    won === true ? "won" : won === null ? "pending" : "nominee",
  );

  const text = $derived.by(() => {
    switch (state) {
      case "won":
        return m.tag_text_award_won();
      case "pending":
        return m.tag_text_award_pending();
      case "nominee":
        return m.tag_text_award_nominee();
    }
  });
</script>

{#snippet icon()}
  <LaurelIcon />
{/snippet}

{#if variant === "cover"}
  <span class="trakt-award-cover-tag" data-state={state}>
    <StemTag {text} icon={won ? icon : undefined} />
  </span>
{:else}
  <span class="trakt-award-inline-tag" data-state={state}>
    {#if won}
      <LaurelIcon />
    {/if}
    <span class="tag bold uppercase">{text}</span>
  </span>
{/if}

<style lang="scss">
  .trakt-award-cover-tag {
    display: contents;

    --color-foreground-stem-tag: var(--color-foreground-award-tag-nominee);

    &[data-state="won"] {
      --color-foreground-stem-tag: var(--color-foreground-award-tag-won);
    }
  }

  .trakt-award-inline-tag {
    display: inline-flex;
    align-items: center;
    justify-self: start;
    gap: var(--gap-xxs);

    width: max-content;
    height: var(--ni-20);
    padding-inline: var(--ni-8);

    border-radius: var(--border-radius-pill);
    background: var(--color-award-tag-background);
    box-shadow: inset 0 0 0 var(--ni-1) var(--color-award-tag-ring);
    color: var(--color-text-secondary);

    font-size: var(--font-size-tag);
    letter-spacing: 0.03em;
    white-space: nowrap;

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }

    &[data-state="won"] {
      background: var(--color-award-gold-soft);
      box-shadow: inset 0 0 0 var(--ni-1) var(--color-award-tag-won-ring);
      color: var(--color-award-gold-text);
    }
  }
</style>
