<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import type { YirDetail } from "$lib/requests/models/YirDetail";
  import { buildYirScenes } from "./scenes/buildYirScenes";
  import YirCompaniesScene from "./scenes/YirCompaniesScene.svelte";
  import YirCountriesScene from "./scenes/YirCountriesScene.svelte";
  import YirCreditsScene from "./scenes/YirCreditsScene.svelte";
  import YirGenresScene from "./scenes/YirGenresScene.svelte";
  import YirPlayScene from "./scenes/YirPlayScene.svelte";
  import YirRatedScene from "./scenes/YirRatedScene.svelte";
  import YirStatsScene from "./scenes/YirStatsScene.svelte";
  import YirThanksScene from "./scenes/YirThanksScene.svelte";
  import YirTopScene from "./scenes/YirTopScene.svelte";
  import YirTrendsScene from "./scenes/YirTrendsScene.svelte";

  const {
    detail,
    slug,
    year,
  }: {
    detail: YirDetail | null;
    slug: string;
    year: number;
  } = $props();

  const scenes = $derived(buildYirScenes(detail));
</script>

{#each scenes as scene, position (scene.id)}
  {@const index = position + 1}
  {#if scene.kind === "play"}
    <YirPlayScene
      id={scene.id}
      {index}
      item={scene.item}
      label={scene.moment === "first"
        ? m.yir_2024_first_play()
        : m.yir_2024_last_play()}
    />
  {:else if scene.kind === "stats"}
    <YirStatsScene id={scene.id} {index} type={scene.type} stats={scene.stats} {year} />
  {:else if scene.kind === "top"}
    <YirTopScene id={scene.id} {index} type={scene.type} items={scene.items} />
  {:else if scene.kind === "companies"}
    <YirCompaniesScene id={scene.id} {index} type={scene.type} companies={scene.companies} />
  {:else if scene.kind === "genres"}
    <YirGenresScene id={scene.id} {index} type={scene.type} group={scene.group} />
  {:else if scene.kind === "rated"}
    <YirRatedScene id={scene.id} {index} type={scene.type} items={scene.items} />
  {:else if scene.kind === "countries"}
    <YirCountriesScene id={scene.id} {index} type={scene.type} group={scene.group} />
  {:else if scene.kind === "trends"}
    <YirTrendsScene id={scene.id} {index} type={scene.type} items={scene.items} {year} />
  {:else if scene.kind === "credits"}
    <YirCreditsScene id={scene.id} {index} {slug} {year} />
  {:else if scene.kind === "thanks"}
    <YirThanksScene
      id={scene.id}
      {index}
      shows={scene.shows}
      movies={scene.movies}
      {year}
    />
  {/if}
{/each}
