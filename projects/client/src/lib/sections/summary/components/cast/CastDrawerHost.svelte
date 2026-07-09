<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption.ts";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType.ts";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import CreditMemberItem from "$lib/sections/lists/components/CreditMemberItem.svelte";
  import type { CreditMember } from "$lib/sections/lists/models/CreditMember.ts";
  import { toCreditMembers } from "$lib/sections/lists/toCreditMembers.ts";
  import { fade } from "svelte/transition";

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

  const toCreditMemberKey = (member: CreditMember) =>
    `${member.key}-${member.positions ? "cast" : "crew"}`;

  const { cast: castMembers, crew: crewMembers } = $derived(
    toCreditMembers({ crew, type }),
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
      `${name} ${description}`
        .toLocaleLowerCase()
        .includes(normalizedSearchTerm),
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
