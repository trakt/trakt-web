<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    title,
    description,
    children,
    titlePrefix,
    indented = false,
  }: ChildrenProps & {
    title: string;
    description?: string;
    titlePrefix?: Snippet;
    indented?: boolean;
  } = $props();
</script>

<div class="trakt-settings-block">
  <div class="trakt-settings-block-header" class:is-indented={indented}>
    <p
      class="settings-title bold"
      class:has-prefix={Boolean(titlePrefix)}
    >
      {#if titlePrefix}{@render titlePrefix()}{/if}{title}
    </p>
    {#if description}<p class="secondary">{description}</p>{/if}
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

    &.is-indented {
      padding-inline: var(--gap-m);
    }

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
