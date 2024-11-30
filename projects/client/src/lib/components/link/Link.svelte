<script lang="ts">
  const {
    children,
    href,
    target,
    ...props
  }: ChildrenProps & HTMLAnchorProps & HTMLElementProps = $props();
</script>

{#if href}
  <a {href} {target} class="trakt-link" {...props}>
    {@render children?.()}
  </a>
{:else}
  {@render children?.()}
{/if}

<style>
  .trakt-link {
    -webkit-tap-highlight-color: transparent;
    display: content;
    color: inherit;

    text-decoration: none;
    cursor: pointer;

    &:visited {
      color: inherit;
    }
  }
</style>
