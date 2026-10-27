<script lang="ts">
  import CollapseIcon from "$lib/components/lists/section-list/CollapseIcon.svelte";
  import { Accordion } from "bits-ui";
  import type { Snippet } from "svelte";

  const { value, isOpen, trigger, preview, children }: {
    value: string;
    isOpen: boolean;
    trigger: Snippet;
    preview?: Snippet;
    children: Snippet;
  } = $props();
</script>

<Accordion.Item {value} class="trakt-recap-accordion-item">
  <Accordion.Header>
    <Accordion.Trigger class="recap-accordion-trigger">
      {@render trigger()}
      <span class="recap-accordion-caret" class:is-open={isOpen} aria-hidden="true">
        <CollapseIcon
          state={isOpen ? "expanded" : "collapsed"}
          variant="bare"
          size={20}
        />
      </span>
    </Accordion.Trigger>
  </Accordion.Header>

  {@render preview?.()}

  <Accordion.Content class="recap-accordion-content">
    {@render children()}
  </Accordion.Content>
</Accordion.Item>

<style lang="scss">
  :global(.trakt-recap-accordion-item) {
    display: flex;
    flex-direction: column;
    gap: var(--recap-accordion-gap, 0);
  }

  :global(.recap-accordion-trigger) {
    all: unset;
    box-sizing: border-box;

    display: flex;
    align-items: center;
    gap: var(--gap-s);

    width: 100%;
    min-height: var(--recap-accordion-trigger-height);
    padding-inline: var(--recap-accordion-trigger-padding, 0);

    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &:focus-visible {
      outline: var(--border-thickness-xs) solid currentColor;
      outline-offset: var(--recap-accordion-focus-offset);
    }
  }

  :global(.recap-accordion-caret) {
    display: flex;
    flex-shrink: 0;
    margin-inline-start: auto;
    color: var(--color-text-secondary);

    &.is-open {
      color: var(--color-text-emphasis);
    }
  }

  :global(.recap-accordion-content[data-state="open"]) {
    animation: recap-accordion-reveal var(--transition-duration-short) ease-out;
  }

  @keyframes recap-accordion-reveal {
    from {
      opacity: 0;
      transform: translateY(calc(-1 * var(--gap-xs)));
    }
  }
</style>
