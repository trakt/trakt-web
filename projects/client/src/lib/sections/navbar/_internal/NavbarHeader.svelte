<script lang="ts">
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import { useNavbarState } from "../useNavbarState";

  const { state } = useNavbarState();
</script>

{#if $state.header?.title}
  {@const header = $state.header}
  <div class="trakt-navbar-header">
    {#snippet titleContent()}
      {#if header?.back}
        <span class="header-back-caret"><CaretLeftIcon /></span>
      {/if}
      <div class="trakt-navbar-header-title">
        <h1 class="ellipsis">{header?.title}</h1>
        {#if header?.metaInfo}
          {#if typeof header.metaInfo === "string"}
            <span class="ellipsis bold meta-info">{header.metaInfo}</span>
          {:else}
            {@render header.metaInfo()}
          {/if}
        {/if}
      </div>
    {/snippet}

    {#if header?.back}
      <a
        class="trakt-navbar-header-back"
        href={header.back.href}
        aria-label={header.back.label}
      >
        {@render titleContent()}
      </a>
    {:else}
      {@render titleContent()}
    {/if}

    {#if header?.actions}
      <div class="trakt-navbar-header-actions">
        {@render header.actions()}
      </div>
    {/if}
  </div>
{/if}

<style>
  .trakt-navbar-header {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    min-width: 0;
  }

  .trakt-navbar-header-back {
    min-width: 0;

    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    color: inherit;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;

    transition: color var(--transition-increment) ease-in-out;

    &:active {
      color: var(--color-link-active);
    }
  }

  .header-back-caret {
    flex-shrink: 0;

    display: flex;
    align-items: center;
    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .trakt-navbar-header-title {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .meta-info {
      color: var(--list-meta-info-color);
    }
  }

  .trakt-navbar-header-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    :global(.trakt-action-button) {
      :global(svg) {
        width: var(--ni-24);
        height: var(--ni-24);
      }
    }
  }
</style>
