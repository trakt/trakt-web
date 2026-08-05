<script lang="ts">
  import DrawerSearchInput from "$lib/components/drawer/DrawerSearchInput.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType.ts";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import CreditMemberItem from "$lib/sections/lists/components/CreditMemberItem.svelte";
  import type { CreditMember } from "$lib/sections/lists/models/CreditMember.ts";
  import { toCreditMembers } from "$lib/sections/lists/toCreditMembers.ts";
  import DrawerTabTitle from "./DrawerTabTitle.svelte";

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
    isLoading = false,
  }: {
    crew: MediaCrew;
    type: ExtendedMediaType;
    isLoading?: boolean;
  } = $props();

  let searchTerm = $state("");
  let creditsType = $state<CreditsType>("cast");

  const normalizedSearchTerm = $derived(searchTerm.trim().toLocaleLowerCase());
  const isSearching = $derived(normalizedSearchTerm.length > 0);

  const creditsMetaInfo = $derived.by(() => {
    if (isSearching) return m.drawer_meta_info_cast_and_crew();
    if (creditsType === "crew") return m.drawer_meta_info_crew();
    return m.drawer_meta_info_cast();
  });

  const { cast: castMembers, crew: crewMembers } = $derived(
    toCreditMembers({ crew, type }),
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

<div class="drawer-cast-section">
  <DrawerTabTitle title={m.drawer_title_people()}>
    {#snippet metaInfo()}
      <ListMetaInfo text={creditsMetaInfo} />
    {/snippet}

    {#snippet actions()}
      {#if !isLoading && !isSearching}
        <Toggler
          value={creditsType}
          onChange={(value) => (creditsType = value)}
          options={creditOptions}
        />
      {/if}
    {/snippet}
  </DrawerTabTitle>

  {#if isLoading}
    <LoadingIndicator />
  {:else}
    <DrawerSearchInput
      bind:value={searchTerm}
      label={m.input_label_search_credit_members()}
      placeholder={m.input_placeholder_search_credit_members()}
    />

    {#if visibleCredits.length > 0}
      <div
        id={`drawer-cast-list-${type}-${isSearching ? "search" : creditsType}`}
        class="credit-list"
        role="list"
      >
        {#each visibleCredits as item (toCreditMemberKey(item))}
          <CreditMemberItem member={item} {type} />
        {/each}
      </div>
    {:else}
      <p class="credit-list-empty">
        {isSearching
          ? m.list_placeholder_no_filter_results()
          : m.list_placeholder_empty()}
      </p>
    {/if}
  {/if}
</div>

<style lang="scss">
  .drawer-cast-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
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
