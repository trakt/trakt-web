<script lang="ts">
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type {
    CastMember,
    CrewMember,
    MediaCrew,
  } from "$lib/requests/models/MediaCrew";
  import { toTranslatedJob } from "$lib/utils/formatting/string/toTranslatedJob.ts";
  import CreditMemberItem from "$lib/sections/lists/components/CreditMemberItem.svelte";
  import type { CreditMember } from "$lib/sections/lists/models/CreditMember";

  type CreditsType = "cast" | "crew";

  const creditOptions: ToggleOption<CreditsType>[] = [
    {
      value: "cast",
      text: m.drawer_meta_info_cast,
      label: m.drawer_meta_info_cast,
    },
    {
      value: "crew",
      text: m.drawer_meta_info_crew,
      label: m.drawer_meta_info_crew,
    },
  ];

  const {
    crew,
    type,
  }: {
    crew: MediaCrew;
    type: ExtendedMediaType;
  } = $props();

  let searchTerm = $state("");
  let creditsType = $state<CreditsType>("cast");

  const normalizedSearchTerm = $derived(searchTerm.trim().toLocaleLowerCase());
  const isSearching = $derived(normalizedSearchTerm.length > 0);

  const castPositions = $derived(
    type === "movie"
      ? { movies: "acting" as const }
      : { shows: "acting" as const },
  );

  const toCastDescriptionItems = (castMember: CastMember) =>
    (castMember.characters ?? [castMember.characterName])
      .filter(Boolean)
      .map((character) => character!.trim())
      .filter(Boolean);

  const toCastCreditMember = (castMember: CastMember): CreditMember => ({
    description: toCastDescriptionItems(castMember).join(", "),
    episodeCount: castMember.episodeCount,
    headshot: castMember.headshot,
    key: castMember.key,
    name: castMember.name,
    positions: castPositions,
  });

  const toCrewCreditMember = (crewMember: CrewMember): CreditMember => {
    const translatedJobs = crewMember.jobs.map((job) => toTranslatedJob(job));
    return {
      description: translatedJobs.join(", "),
      episodeCount: crewMember.episodeCount,
      key: crewMember.key,
      name: crewMember.name,
    };
  };

  const mergeCrewMembers = (
    currentMember: CrewMember,
    nextMember: CrewMember,
  ): CrewMember => {
    const episodeCounts = [
      currentMember.episodeCount,
      nextMember.episodeCount,
    ].filter((count): count is number => count != null);
    const episodeCount =
      episodeCounts.length > 0 ? Math.max(...episodeCounts) : undefined;

    return {
      ...currentMember,
      episodeCount,
      jobs: [...new Set([...currentMember.jobs, ...nextMember.jobs])],
    };
  };

  const uniqueCrewMembers = (members: CrewMember[]) => {
    const membersByKey = members.reduce(
      (map, member) => {
        const currentMember = map.get(member.key);
        return map.set(
          member.key,
          currentMember ? mergeCrewMembers(currentMember, member) : member,
        );
      },
      new Map<string, CrewMember>(),
    );
    return [...membersByKey.values()];
  };

  const castMembers = $derived(crew.cast.map(toCastCreditMember));
  const crewMembers = $derived(
    uniqueCrewMembers([
      ...crew.creators,
      ...crew.directors,
      ...crew.writers,
    ]).map(toCrewCreditMember),
  );

  const selectedCredits = $derived(
    creditsType === "cast" ? castMembers : crewMembers,
  );

  const toCreditMemberKey = (member: CreditMember) =>
    `${member.key}-${member.positions ? "cast" : "crew"}`;

  const visibleCredits = $derived(
    isSearching
      ? [...castMembers, ...crewMembers].filter(({ description, name }) =>
          `${name} ${description}`.toLocaleLowerCase().includes(
            normalizedSearchTerm,
          ),
        )
      : selectedCredits,
  );
</script>

<div class="season-cast-section">
  <div class="cast-header">
    <label class="credit-search">
      <SearchIcon />
      <input
        bind:value={searchTerm}
        type="search"
        aria-label={m.input_label_search_credit_members()}
        placeholder={m.input_placeholder_search_credit_members()}
      />
    </label>

    {#if !isSearching}
      <Toggler
        value={creditsType}
        onChange={(value) => (creditsType = value)}
        options={creditOptions}
      />
    {/if}
  </div>

  {#if visibleCredits.length > 0}
    <div
      id={`season-cast-list-${type}-${isSearching ? "search" : creditsType}`}
      class="credit-list"
      role="list"
    >
      {#each visibleCredits as item (toCreditMemberKey(item))}
        <CreditMemberItem member={item} {type} />
      {/each}
    </div>
  {:else}
    <p class="credit-list-empty">{m.list_placeholder_empty()}</p>
  {/if}
</div>

<style lang="scss">
  .season-cast-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .cast-header {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .credit-search {
    display: flex;
    align-items: center;
    flex: 1;

    min-height: var(--ni-48);
    border-radius: var(--border-radius-xxl);
    padding: 0 var(--ni-16);

    background-color: var(--color-background-elevated);

    :global(svg) {
      flex-shrink: 0;
      color: var(--color-text-secondary);
      margin-right: var(--ni-8);
    }

    input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--color-text-primary);

      &::placeholder {
        color: var(--color-text-secondary);
      }
    }
  }

  .credit-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .credit-list-empty {
    color: var(--color-text-secondary);
  }
</style>
