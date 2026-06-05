<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    title,
    description,
    children,
    boldTitle = false,
    titlePrefix,
  }: ChildrenProps & {
    title: string;
    description: string;
    boldTitle?: boolean;
    titlePrefix?: Snippet;
  } = $props();
</script>

<div class="trakt-settings-block">
  <div class="trakt-settings-block-header">
    <p
      class="settings-title"
      class:bold={boldTitle}
      class:has-prefix={Boolean(titlePrefix)}
    >
      {#if titlePrefix}{@render titlePrefix()}{/if}{title}
    </p>
    <p class="secondary">{description}</p>
  </div>
  <div class="trakt-settings-block-content">
    {@render children()}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings-block-header {
    display: flex;
    flex-direction: column;

    gap: var(--gap-xs);

    p.settings-title {
      transition: font-size var(--transition-increment) ease-in-out;
      text-transform: capitalize;
      font-size: var(--font-size-title);

      &.has-prefix {
        display: flex;
        align-items: baseline;
        gap: var(--ni-6);

        :global(span),
        :global(.trakt-link) {
          font-size: inherit;
          font-weight: inherit;
        }
      }
    }
  }

  .trakt-settings-block,
  .trakt-settings-block-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }
</style>
