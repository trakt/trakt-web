<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PulseGraphData } from "./models/PulseGraphData";

  const { data }: { data: PulseGraphData["showsMovies"] } = $props();

  const total = $derived(data.episodes + data.movies);
  const showsPct = $derived(total > 0 ? (data.episodes / total) * 100 : 50);
</script>

<div class="graph-shows-movies">
  <div class="sm-counts">
    <div class="sm-count">
      <span class="sm-count-value sm-color-shows">{data.episodes}</span>
      <span class="sm-count-label">{m.label_stats_episodes()}</span>
    </div>
    <div class="sm-count">
      <span class="sm-count-value sm-color-movies">{data.movies}</span>
      <span class="sm-count-label">{m.label_stats_movies()}</span>
    </div>
  </div>
  <div class="sm-bar-track">
    <div class="sm-bar-shows" style:width="{showsPct}%"></div>
    <div class="sm-bar-movies" style:width="{100 - showsPct}%"></div>
  </div>
</div>

<style lang="scss">
  .graph-shows-movies {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: flex-end;
    gap: var(--ni-12);
  }

  .sm-counts {
    display: flex;
    gap: var(--ni-24);
    flex: 1;
    align-items: center;
  }

  .sm-count {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
  }

  .sm-count-value {
    font-size: var(--ni-32);
    font-weight: 700;
    line-height: 1;
  }

  .sm-count-label {
    font-size: var(--ni-13);
    color: var(--shade-400);
  }

  .sm-color-shows {
    color: var(--purple-400);
  }

  .sm-color-movies {
    color: var(--orange-400);
  }

  .sm-bar-track {
    display: flex;
    height: var(--ni-8);
    border-radius: var(--ni-4);
    overflow: hidden;
  }

  .sm-bar-shows {
    background: var(--purple-500);
    min-width: 2px;
  }

  .sm-bar-movies {
    background: var(--orange-500);
    min-width: 2px;
  }
</style>
