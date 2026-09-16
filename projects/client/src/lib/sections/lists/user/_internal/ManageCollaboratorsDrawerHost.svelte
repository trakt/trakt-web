<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DrawerSearchInput from "$lib/components/drawer/DrawerSearchInput.svelte";
  import DropdownGroup from "$lib/components/dropdown/DropdownGroup.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { toUserSlug } from "$lib/utils/profile/toUserSlug";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { map } from "rxjs";
  import CollaboratorRow from "./CollaboratorRow.svelte";
  import type { CollaboratorCandidate } from "./useManageCollaborators";
  import { useManageCollaborators } from "./useManageCollaborators";

  const { list, onClose }: { list: MediaListSummary; onClose: () => void } =
    $props();

  const target$ = fromRune(() => list).pipe(
    map((currentList) => ({
      listId: currentList.id,
      ownerSlug: toUserSlug(currentList.user),
    })),
  );

  const {
    candidates,
    isLoading,
    pendingUserId,
    addCollaborator,
    removeCollaborator,
  } = useManageCollaborators(target$);

  let searchTerm = $state("");

  const normalizedSearchTerm = $derived(searchTerm.trim().toLocaleLowerCase());

  const visibleCandidates = $derived.by(() => {
    if (!normalizedSearchTerm) return $candidates;

    return $candidates.filter(({ profile }) =>
      `${profile.name.full} ${profile.username}`
        .toLocaleLowerCase()
        .includes(normalizedSearchTerm)
    );
  });

  const addedCandidates = $derived(
    visibleCandidates.filter((candidate) => candidate.isCollaborator),
  );
  const otherCandidates = $derived(
    visibleCandidates.filter((candidate) => !candidate.isCollaborator),
  );

  function handleToggle(candidate: CollaboratorCandidate) {
    if (candidate.isCollaborator) {
      removeCollaborator(candidate.profile);
      return;
    }

    addCollaborator(candidate.profile);
  }
</script>

{#snippet section(title: string, sectionCandidates: CollaboratorCandidate[])}
  {#if sectionCandidates.length > 0}
    <section class="collaborator-section">
      <p class="section-title tag secondary uppercase">{title}</p>
      <DropdownGroup>
        {#each sectionCandidates as candidate (candidate.profile.id)}
          <CollaboratorRow
            {candidate}
            isPending={$pendingUserId === candidate.profile.id}
            onToggle={() => handleToggle(candidate)}
          />
        {/each}
      </DropdownGroup>
    </section>
  {/if}
{/snippet}

<Drawer {onClose} size="auto" title={m.page_title_manage_collaborators()}>
  <p class="secondary">{m.description_manage_collaborators()}</p>

  <DrawerSearchInput
    bind:value={searchTerm}
    label={m.input_label_search_collaborators()}
    placeholder={m.input_placeholder_search_collaborators()}
  />

  {#if $isLoading}
    <LoadingIndicator />
  {:else if visibleCandidates.length === 0}
    <p class="empty-state small secondary">
      {$candidates.length > 0
        ? m.list_placeholder_empty()
        : m.text_no_collaborator_candidates()}
    </p>
  {:else}
    <div class="collaborator-sections">
      {@render section(m.list_title_collaborators(), addedCandidates)}
      {@render section(m.button_text_followers(), otherCandidates)}
    </div>
  {/if}
</Drawer>

<style lang="scss">
  .empty-state {
    padding: var(--gap-m);
  }

  .collaborator-sections {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .collaborator-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .section-title {
    margin: 0;
    padding-inline-start: var(--ni-16);
  }
</style>
