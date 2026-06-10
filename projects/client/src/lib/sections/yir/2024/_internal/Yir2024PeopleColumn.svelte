<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { YirPeopleType } from "$lib/requests/models/YirPerson.ts";
  import { useYirPeople } from "../../_internal/useYirPeople.ts";
  import Yir2024PersonRow from "./Yir2024PersonRow.svelte";

  type Yir2024PeopleColumnProps = {
    slug: string;
    year: number;
    type: YirPeopleType;
    title: string;
  };

  const { slug, year, type, title }: Yir2024PeopleColumnProps = $props();

  const { people, isLoading } = $derived(useYirPeople({ slug, year, type }));
</script>

{#if $isLoading || ($people?.length ?? 0) > 0}
  <div class="trakt-yir-2024-people-column">
    <header class="yir-2024-people-column-header">
      <span class="uppercase yir-2024-people-column-label">
        {m.yir_2024_people_label()}
      </span>
      <h2 class="bold yir-2024-people-column-title">{title}</h2>
    </header>

    {#if ($people?.length ?? 0) > 0}
      <ol class="yir-2024-people-list" role="list">
        {#each $people ?? [] as person, index (person.id)}
          <Yir2024PersonRow {person} rank={index + 1} />
        {/each}
      </ol>
    {:else}
      <p class="yir-2024-people-column-loading">{m.yir_state_loading()}</p>
    {/if}
  </div>
{/if}

<style>
  .trakt-yir-2024-people-column {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .yir-2024-people-column-header {
    margin-bottom: var(--ni-12);
  }

  .yir-2024-people-column-label {
    display: block;
    font-size: var(--font-size-text);
    letter-spacing: 2px;
    color: var(--shade-10);
  }

  .yir-2024-people-column-title {
    margin: var(--ni-2) 0 0;
    font-size: var(--ni-32);
    line-height: 1.1;
    color: var(--shade-10);
  }

  /* Capped height with its own scroll, so each of the four columns scrolls
     independently within the panel. */
  .yir-2024-people-list {
    list-style: none;
    margin: 0;
    padding: 0;
    /* ~4 rows tall; the rest scrolls within the column. */
    max-height: var(--ni-240);
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .yir-2024-people-column-loading {
    margin: 0;
    padding: var(--ni-20) 0;
    color: var(--shade-500);
  }
</style>
