<script lang="ts">
  import type { MentionListProps } from "./MentionListProps.ts";

  const { mentions, onPick, activeIndex = -1 }: MentionListProps = $props();
</script>

<ul
  class="trakt-mention-list"
  role="listbox"
  onmousedown={(e) => e.preventDefault()}
>
  {#each mentions as mention, index (mention.href)}
    <li role="option" aria-selected={index === activeIndex}>
      <button
        type="button"
        class="mention-option"
        class:is-active={index === activeIndex}
        onclick={() => onPick(mention)}
      >
        <span class="bold ellipsis">{mention.name}</span>
        {#if mention.detail}
          <span class="secondary tag ellipsis">{mention.detail}</span>
        {/if}
      </button>
    </li>
  {/each}
</ul>

<style>
  .trakt-mention-list {
    all: unset;
    display: flex;
    flex-direction: column;

    max-height: var(--ni-160);
    overflow-y: auto;

    .mention-option {
      all: unset;
      box-sizing: border-box;
      width: 100%;

      display: flex;
      align-items: baseline;
      gap: var(--gap-xs);

      padding: var(--ni-6) var(--ni-8);
      border-radius: var(--border-radius-s);

      cursor: pointer;

      &:hover,
      &.is-active {
        background-color: var(--color-input-background);
      }

      &:focus-visible {
        outline: var(--border-thickness-xs) solid var(--color-input-focus);
      }
    }
  }
</style>
