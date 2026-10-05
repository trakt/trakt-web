<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
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
  import { fade } from "svelte/transition";
  import DrawerCreditListSkeleton from "$lib/sections/summary/components/_internal/DrawerCreditListSkeleton.svelte";

  const {
    onClose,
    crew,
    type,
    isLoading = false,
  }: {
    crew: MediaCrew;
    type: ExtendedMediaType;
    onClose: () => void;
    isLoading?: boolean;
  } = $props();

  let isOpen = $state(false);
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

  const toCreditMemberKey = (member: CreditMember) =>
    `${member.key}-${member.positions ? "cast" : "crew"}`;
  const toCreditGroupHeaderId = (group: { id: string }) =>
    `cast-list-${type}-${isSearching ? "search" : activeCreditsType}-${group.id}-header`;

  const visibleCreditGroups = $derived(
    toVisibleCreditGroups({
      groups: creditGroups,
      searchTerm: normalizedSearchTerm,
      creditsType: activeCreditsType,
    }),
  );
</script>

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.drawer_title_people()}
  size="large"
  headerVariant="overlay"
>
  {#if isOpen}
    <div class="cast-drawer-content" transition:fade={{ duration: 150 }}>
      <DrawerSearchInput
        bind:value={searchTerm}
        label={m.input_label_search_credit_members()}
        placeholder={m.input_placeholder_search_credit_members()}
      />

      {#if isLoading}
        <DrawerCreditListSkeleton />
      {:else if visibleCreditGroups.length > 0}
        <div
          id={`cast-list-${type}-${isSearching ? "search" : activeCreditsType}`}
          class="credit-list"
        >
          {#each visibleCreditGroups as group (group.id)}
            <section class="credit-list-group">
              <CreditGroupHeader
                id={toCreditGroupHeaderId(group)}
                label={group.label}
                count={group.members.length}
              />

              <div
                class="credit-list-group-items"
                role="list"
                aria-labelledby={toCreditGroupHeaderId(group)}
              >
                {#each group.members as item (toCreditMemberKey(item))}
                  <CreditMemberItem member={item} {type} />
                {/each}
              </div>
            </section>
          {/each}
        </div>
      {:else}
        <p class="credit-list-empty">{m.list_placeholder_empty()}</p>
      {/if}
    </div>
  {/if}

  {#snippet badge()}
    {#if !isSearching && !isLoading}
      <CreditsToggler
        groups={creditGroups}
        value={activeCreditsType}
        onChange={(value) => (creditsType = value)}
      />
    {/if}
  {/snippet}
</Drawer>

<style lang="scss">
  .cast-drawer-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    .credit-list,
    .credit-list-group,
    .credit-list-group-items {
      display: flex;
      flex-direction: column;
    }

    .credit-list {
      gap: var(--gap-m);
    }

    .credit-list-group {
      gap: var(--gap-xs);
    }

    .credit-list-group-items {
      gap: var(--gap-s);
    }

    .credit-list-empty {
      color: var(--color-text-secondary);
    }
  }
</style>
