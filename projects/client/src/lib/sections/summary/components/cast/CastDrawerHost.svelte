<script lang="ts">
  import { useSplitCast } from "$lib/features/feature-flag/useSplitCast.ts";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DrawerSearchInput from "$lib/components/drawer/DrawerSearchInput.svelte";
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption.ts";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType.ts";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import CreditMemberItem from "$lib/sections/lists/components/CreditMemberItem.svelte";
  import type { CreditMember } from "$lib/sections/lists/models/CreditMember.ts";
  import { toCreditGroups } from "$lib/sections/summary/components/toCreditGroups.ts";
  import { fade } from "svelte/transition";
  import CreditGroupHeader from "$lib/sections/summary/components/CreditGroupHeader.svelte";

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

  const toCreditMemberKey = (member: CreditMember) =>
    `${member.key}-${member.positions ? "cast" : "crew"}`;
  const toCreditGroupHeaderId = (group: { id: string }) =>
    `cast-list-${type}-${isSearching ? "search" : creditsType}-${group.id}-header`;

  const visibleCreditGroups = $derived.by(() => {
    const groups = toCreditGroups({ crew, type, splitCast: $splitCast, searchTerm: normalizedSearchTerm })
      .filter((group) => isSearching || group.type === creditsType)
      .map((group) => ({
        ...group,
        showHeader: isSearching || group.type === "cast",
      }));
    if ($splitCast || groups.length === 0) return groups;
    return [{
      id: "credits",
      type: creditsType,
      label: creditsMetaInfo,
      members: groups.flatMap((group) => group.members),
      showHeader: false,
    }];
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
      <DrawerSearchInput
        bind:value={searchTerm}
        label={m.input_label_search_credit_members()}
        placeholder={m.input_placeholder_search_credit_members()}
      />

      {#if visibleCreditGroups.length > 0}
        <div
          id={`cast-list-${type}-${isSearching ? "search" : creditsType}`}
          class="credit-list"
        >
          {#each visibleCreditGroups as group (group.id)}
            <section class="credit-list-group">
              {#if group.showHeader}
                <CreditGroupHeader
                  id={toCreditGroupHeaderId(group)}
                  label={group.label}
                  count={group.members.length}
                />
              {/if}

              <div
                class="credit-list-group-items"
                role="list"
                aria-labelledby={group.showHeader
                  ? toCreditGroupHeaderId(group)
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
