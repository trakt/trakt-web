<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
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
  import { fade } from "svelte/transition";
  import CreditMemberItem from "../../../lists/components/CreditMemberItem.svelte";
  import type { CreditMember } from "../../../lists/models/CreditMember";

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
    onClose,
    crew,
    type,
  }: {
    crew: MediaCrew;
    type: ExtendedMediaType;
    onClose: () => void;
  } = $props();

  let isOpen = $state(false);
  let searchTerm = $state("");
  let creditsType = $state<CreditsType>("cast");

  const normalizedSearchTerm = $derived(searchTerm.trim().toLocaleLowerCase());
  const isSearching = $derived(normalizedSearchTerm.length > 0);
  const creditsMetaInfo = $derived.by(() => {
    if (isSearching) return m.drawer_meta_info_cast_and_crew();
    if (creditsType === "crew") return m.drawer_meta_info_crew();

    return m.drawer_meta_info_cast();
  });

  const castPositions = $derived(
    type === "movie"
      ? { movies: "acting" as const }
      : { shows: "acting" as const },
  );

  const toCastDescriptionItems = (castMember: CastMember) =>
    (castMember.characters ?? [castMember.characterName])
      .filter(Boolean)
      .map((character) => character.trim())
      .filter(Boolean);

  const toCastCreditMember = (castMember: CastMember): CreditMember => {
    const descriptionItems = toCastDescriptionItems(castMember);

    return {
      description: descriptionItems.join(", "),
      descriptionItems,
      episodeCount: castMember.episodeCount,
      headshot: castMember.headshot,
      key: castMember.key,
      name: castMember.name,
      positions: castPositions,
    };
  };

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
    const episodeCount = episodeCounts.length > 0
      ? Math.max(...episodeCounts)
      : undefined;

    return {
      ...currentMember,
      ...(episodeCount != null ? { episodeCount } : {}),
      jobs: [...new Set([...currentMember.jobs, ...nextMember.jobs])],
    };
  };

  const uniqueCrewMembers = (members: CrewMember[]): CrewMember[] => {
    const membersByKey = members.reduce((map, member) => {
      const currentMember = map.get(member.key);
      return map.set(
        member.key,
        currentMember ? mergeCrewMembers(currentMember, member) : member,
      );
    }, new Map<string, CrewMember>());

    return [...membersByKey.values()];
  };
  const toCreditMemberKey = (member: CreditMember) =>
    `${member.key}-${member.positions ? "cast" : "crew"}`;

  const castMembers = $derived(
    crew.cast.map(toCastCreditMember),
  );
  const crewMembers = $derived(
    uniqueCrewMembers([
      ...crew.creators,
      ...crew.directors,
      ...crew.writers,
    ]).map(toCrewCreditMember),
  );
  const allCredits = $derived([...castMembers, ...crewMembers]);
  const selectedCredits = $derived.by(() => {
    if (isSearching) return allCredits;
    if (creditsType === "crew") return crewMembers;

    return castMembers;
  });
  const visibleCredits = $derived.by(() => {
    if (!isSearching) {
      return selectedCredits;
    }

    return selectedCredits.filter(({ description, name }) =>
      `${name} ${description}`.toLocaleLowerCase().includes(
        normalizedSearchTerm,
      )
    );
  });
</script>

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.drawer_title_people()}
  metaInfo={creditsMetaInfo}
  size="large"
  headerVariant="overlay"
>
  {#if isOpen}
    <div class="cast-drawer-content" transition:fade={{ duration: 150 }}>
      <label class="credit-search">
        <SearchIcon />
        <input
          bind:value={searchTerm}
          type="search"
          aria-label={m.input_label_search_credit_members()}
          placeholder={m.input_placeholder_search_credit_members()}
        />
      </label>

      {#if visibleCredits.length > 0}
        <div
          id={`cast-list-${type}-${isSearching ? "search" : creditsType}`}
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
  {/if}

  {#snippet badge()}
    {#if !isSearching}
      <Toggler
        value={creditsType}
        onChange={(value) => (creditsType = value)}
        options={creditOptions}
      />
    {/if}
  {/snippet}
</Drawer>

<style lang="scss">
  .cast-drawer-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    .credit-search {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);

      min-height: var(--ni-48);
      padding: 0 var(--ni-16);
      box-sizing: border-box;

      border-radius: var(--border-radius-l);
      background: var(--color-input-background);
      outline: var(--border-thickness-xxs) solid var(--color-border);

      transition: outline var(--transition-increment) ease-in-out;

      &:focus-within {
        outline: var(--border-thickness-xs) solid var(--purple-500);
      }

      :global(svg) {
        flex-shrink: 0;
        width: var(--ni-24);
        height: var(--ni-24);
        color: var(--color-text-secondary);
      }

      input {
        all: unset;
        min-width: 0;
        width: 100%;
        height: 100%;
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
  }
</style>
