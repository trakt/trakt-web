<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import type { YirPeopleType } from "$lib/requests/models/YirPerson";
  import YirCreditsColumn from "./YirCreditsColumn.svelte";
  import YirScene from "./YirScene.svelte";

  const {
    id,
    index,
    slug,
    year,
  }: {
    id: string;
    index: number;
    slug: string;
    year: number;
  } = $props();

  const roles: ReadonlyArray<{ type: YirPeopleType; role: () => string }> = [
    { type: "actors", role: m.yir_2024_people_actors },
    { type: "actresses", role: m.yir_2024_people_actresses },
    { type: "directors", role: m.yir_2024_people_directors },
    { type: "writers", role: m.yir_2024_people_writers },
  ];
</script>

<YirScene {id} {index} kicker={m.yir_2026_credits_kicker()} title={m.yir_2024_people_label()}>
  {#snippet children()}
    <div class="yir-credits">
      {#each roles as { type, role } (type)}
        <YirCreditsColumn {slug} {year} {type} role={role()} />
      {/each}
    </div>
  {/snippet}
</YirScene>

<style>
  .yir-credits {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--ni-48) var(--ni-64);
  }

  @container (min-width: 40rem) {
    .yir-credits {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @container (min-width: 68rem) {
    .yir-credits {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: var(--ni-48) var(--ni-32);
    }
  }
</style>
