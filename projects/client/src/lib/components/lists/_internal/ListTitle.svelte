<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import type { Snippet } from "svelte";

  const {
    title,
    metaInfo,
    style,
    href,
  }: {
    title: string;
    metaInfo?: Snippet;
    href?: string;
    style: "primary" | "secondary";
  } = $props();
</script>

{#snippet content()}
  <h5 class="shadow-list-title ellipsis" data-style={style}>
    {title}
  </h5>
{/snippet}

<div class="trakt-list-title">
  {#if href}
    <Link {href}>{@render content()}</Link>
  {:else}
    {@render content()}
  {/if}

  {#if metaInfo}
    {@render metaInfo()}
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-title {
    display: flex;
    flex-direction: column;
    min-width: 0;

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .shadow-list-title {
    &[data-style="primary"] {
      color: var(--color-text-primary);
    }

    &[data-style="secondary"] {
      color: var(--color-text-secondary);
    }

    /** FIXME: remove when we have adaptive typography and updated sizes */
    font-size: var(--ni-18);
    line-height: var(--ni-22);
    &.ellipsis {
      max-width: 100%;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: block;
    }
  }
</style>
