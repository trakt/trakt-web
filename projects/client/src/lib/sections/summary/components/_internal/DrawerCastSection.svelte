<script lang="ts">
  import DrawerSearchInput from "$lib/components/drawer/DrawerSearchInput.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType.ts";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import CreditMemberItem from "$lib/sections/lists/components/CreditMemberItem.svelte";
  import type { CreditMember } from "$lib/sections/lists/models/CreditMember.ts";
  import CreditGroupHeader from "$lib/sections/summary/components/CreditGroupHeader.svelte";
  import CreditsToggler from "$lib/sections/summary/components/CreditsToggler.svelte";
  import { toActiveCreditsType } from "$lib/sections/summary/components/toActiveCreditsType.ts";
  import { toCreditGroups } from "$lib/sections/summary/components/toCreditGroups.ts";
  import { toVisibleCreditGroups } from "$lib/sections/summary/components/toVisibleCreditGroups.ts";
  import type { CreditsType } from "$lib/sections/summary/models/CreditsType.ts";
  import DrawerCreditListSkeleton from "./DrawerCreditListSkeleton.svelte";
  import DrawerTabTitle from "./DrawerTabTitle.svelte";

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
  let creditsType = $state<CreditsType>("main");

  const normalizedSearchTerm = $derived(searchTerm.trim().toLocaleLowerCase());
  const isSearching = $derived(normalizedSearchTerm.length > 0);

  const creditGroups = $derived(
    toCreditGroups({ crew, type }),
  );
  const activeCreditsType = $derived(
    toActiveCreditsType({ groups: creditGroups, creditsType }),
  );

  const visibleCreditGroups = $derived(
    toVisibleCreditGroups({
      groups: creditGroups,
      searchTerm: normalizedSearchTerm,
      creditsType: activeCreditsType,
    }),
  );

  const toCreditMemberKey = (member: CreditMember) =>
    `${member.key}-${member.positions ? "cast" : "crew"}`;
</script>

<div class="drawer-cast-section">
  <DrawerTabTitle title={m.drawer_title_people()}>
    {#snippet actions()}
      {#if !isSearching && !isLoading}
        <CreditsToggler
          groups={creditGroups}
          value={activeCreditsType}
          onChange={(value) => (creditsType = value)}
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
      id={`drawer-cast-list-${type}-${isSearching ? "search" : activeCreditsType}`}
      class="credit-groups"
    >
      {#each visibleCreditGroups as group (group.id)}
        <section class="credit-group">
          <CreditGroupHeader
            id={`drawer-credit-${type}-${group.id}-header`}
            label={group.label}
            count={group.members.length}
          />
          <div
            class="credit-list"
            role="list"
            aria-labelledby={`drawer-credit-${type}-${group.id}-header`}
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
