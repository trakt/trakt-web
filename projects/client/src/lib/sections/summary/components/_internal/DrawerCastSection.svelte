<script lang="ts">
  import { useSplitCast } from "$lib/features/feature-flag/useSplitCast.ts";
  import DrawerSearchInput from "$lib/components/drawer/DrawerSearchInput.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType.ts";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import CreditMemberItem from "$lib/sections/lists/components/CreditMemberItem.svelte";
  import type { CreditMember } from "$lib/sections/lists/models/CreditMember.ts";
  import { toCreditGroups } from "$lib/sections/summary/components/toCreditGroups.ts";
  import CreditGroupHeader from "$lib/sections/summary/components/CreditGroupHeader.svelte";
  import DrawerCreditListSkeleton from "./DrawerCreditListSkeleton.svelte";
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

  const splitCast = useSplitCast();

  let searchTerm = $state("");
  let creditsType = $state<CreditsType>("cast");

  const normalizedSearchTerm = $derived(searchTerm.trim().toLocaleLowerCase());
  const isSearching = $derived(normalizedSearchTerm.length > 0);

  const creditsMetaInfo = $derived.by(() => {
    if (isSearching) return m.drawer_meta_info_cast_and_crew();
    if (creditsType === "crew") return m.drawer_meta_info_crew();
    return m.drawer_meta_info_cast();
  });

  const visibleCreditGroups = $derived.by(() => {
    const groups = toCreditGroups({
      crew,
      type,
      splitCast: $splitCast, searchTerm: normalizedSearchTerm,
      mainCastLabel: m.header_main_cast(),
    }).filter((group) => isSearching || group.type === creditsType);

    if (($splitCast && type !== "movie") || groups.length === 0) return groups;

    return [{
      id: "credits",
      label: creditsMetaInfo,
      members: groups.flatMap((group) => group.members),
      type: creditsType,
    }];
  });

  const toCreditMemberKey = (member: CreditMember) =>
    `${member.key}-${member.positions ? "cast" : "crew"}`;

  const showGroupHeaders = $derived(
    $splitCast && type !== "movie" && (isSearching || creditsType === "cast"),
  );
</script>

<div class="drawer-cast-section">
  <DrawerTabTitle title={m.drawer_title_people()}>
    {#snippet metaInfo()}
      <ListMetaInfo text={creditsMetaInfo} />
    {/snippet}

    {#snippet actions()}
      {#if !isSearching}
        <Toggler
          value={creditsType}
          onChange={(value) => (creditsType = value)}
          options={creditOptions}
        />
      {/if}
    {/snippet}
  </DrawerTabTitle>

  <DrawerSearchInput
    bind:value={searchTerm}
    label={m.input_label_search_credit_members()}
    placeholder={m.input_placeholder_search_credit_members()}
  />

  {#if isLoading}
    <DrawerCreditListSkeleton />
  {:else if visibleCreditGroups.length > 0}
    <div
      id={`drawer-cast-list-${type}-${isSearching ? "search" : creditsType}`}
      class="credit-groups"
    >
      {#each visibleCreditGroups as group (group.id)}
        <section class="credit-group">
          {#if showGroupHeaders}
            <CreditGroupHeader
              id={`drawer-credit-${type}-${group.id}-header`}
              label={group.label}
              count={group.members.length}
            />
          {/if}
          <div
            class="credit-list"
            role="list"
            aria-labelledby={showGroupHeaders
              ? `drawer-credit-${type}-${group.id}-header`
              : undefined}
          >
            {#each group.members as item (toCreditMemberKey(item))}
              <CreditMemberItem member={item} {type} />
            {/each}
          </div>
        </section>
      {/each}
    </div>
  {:else}
    <p class="credit-list-empty">
      {isSearching
        ? m.list_placeholder_no_filter_results()
        : m.list_placeholder_empty()}
    </p>
  {/if}
</div>

<style lang="scss">
  .drawer-cast-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .credit-groups {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .credit-group {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
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
