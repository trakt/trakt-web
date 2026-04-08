<script lang="ts">
  import { useNavbarState } from "../useNavbarState";

  const { state } = useNavbarState();
</script>

{#if $state.header?.title}
  <div class="trakt-navbar-header">
    <div class="trakt-navbar-header-title">
      <h1 class="ellipsis">{$state.header.title}</h1>
      {#if $state.header?.metaInfo}
        {#if typeof $state.header.metaInfo === "string"}
          <span class="ellipsis bold meta-info">{$state.header.metaInfo}</span>
        {:else}
          {@render $state.header.metaInfo()}
        {/if}
      {/if}
    </div>

    {#if $state.header?.actions}
      <div class="trakt-navbar-header-actions">
        {@render $state.header.actions()}
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
