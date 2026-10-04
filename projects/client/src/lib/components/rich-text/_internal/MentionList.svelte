<script lang="ts">
  import type { MentionListProps } from "./MentionListProps.ts";

  const {
    mentions,
    onPick,
    activeIndex = -1,
    header,
    emptyText,
    id,
  }: MentionListProps = $props();
</script>

<div class="trakt-mention-list" class:has-header={header != null}>
  {#if header}
    <div class="mention-list-header">
      {@render header()}
    </div>
  {/if}

  {#if mentions.length > 0}
    <ul
      {id}
      class="mention-options"
      role="listbox"
      onmousedown={(e) => e.preventDefault()}
    >
      {#each mentions as mention, index (mention.href)}
        <li
          id={id ? `${id}-option-${index}` : undefined}
          role="option"
          aria-selected={index === activeIndex}
        >
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
  {:else if emptyText}
    <p class="mention-empty secondary tag" role="status">{emptyText}</p>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mention-list {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @include input-field-surface;

    .mention-list-header {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);

      padding-block: var(--ni-4);
      padding-inline: var(--ni-12) var(--ni-4);
    }

    &.has-header .mention-options,
    &.has-header .mention-empty {
      border-block-start: var(--border-thickness-xxs) solid var(--color-border);
    }

    .mention-options {
      all: unset;
      display: flex;
      flex-direction: column;

      max-height: var(--ni-160);
      overflow-y: auto;
      padding: var(--ni-4);
    }

    .mention-option {
      all: unset;
      box-sizing: border-box;
      width: 100%;

      display: flex;
      align-items: baseline;
      gap: var(--gap-xs);

      padding: var(--ni-8);
      border-radius: var(--border-radius-s);
      cursor: pointer;

      &.is-active {
        background-color: var(--color-option-list-selected);
      }

      &:hover {
        background-color: var(--color-option-list-selected-hover);
      }

      &:focus-visible {
        outline: var(--border-thickness-xs) solid var(--color-input-focus);
      }
    }

    .mention-empty {
      margin: 0;
      padding: var(--ni-12);
    }
  }
</style>
