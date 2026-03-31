<svelte:options css="injected" />

<script lang="ts">
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";

  const {
    type,
    crew,
  }: {
    type: MediaType;
    crew: MediaCrew;
  } = $props();

  const mainCredits = $derived.by(() => {
    if (type === "movie") {
      const directors = crew.directors.filter((person) =>
        person.jobs.some((job) => job.toLowerCase() === "director"),
      );

      return directors;
    }

    const creator = crew.creators.at(0);
    return creator ? [creator] : [];
  });
</script>

{#if mainCredits.length > 0}
  <div class="trakt-main-credit">
    {#if type === "movie"}
      <span>Directed by</span>
    {:else}
      <span>Created by</span>
    {/if}

    {#each mainCredits as mainCredit, i (mainCredit.key)}
      <b>{mainCredit.name}{i < mainCredits.length - 1 ? "," : ""}</b>
    {/each}
  </div>
{/if}

<style>
  .trakt-main-credit {
    display: flex;
    align-items: center;
    gap: 8px;

    font-size: 26px;
  }
</style>
