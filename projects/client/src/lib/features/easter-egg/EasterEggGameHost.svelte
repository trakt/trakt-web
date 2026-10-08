<script lang="ts">
  import { page } from "$app/state";

  const loadGame = () =>
    import("./_internal/EasterEggGame.svelte").catch((error) => {
      history.back();
      throw error;
    });
</script>

{#if page.state.isPlayingGame}
  {#await loadGame() then { default: EasterEggGame }}
    <EasterEggGame onclose={() => history.back()} />
  {/await}
{/if}
