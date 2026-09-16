<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DrawerSearchInput from "$lib/components/drawer/DrawerSearchInput.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
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
      ownerSlug: currentList.user.slug ?? currentList.user.username,
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
    {#if addedCandidates.length > 0}
      <p class="bold secondary small section-title">
        {m.list_title_collaborators()}
      </p>
      {#each addedCandidates as candidate (candidate.profile.id)}
        <CollaboratorRow
          {candidate}
          isPending={$pendingUserId === candidate.profile.id}
          onToggle={() => handleToggle(candidate)}
        />
      {/each}
    {/if}

    {#if otherCandidates.length > 0}
      <p
        class="bold secondary small section-title"
        class:has-divider={addedCandidates.length > 0}
      >
        {m.button_text_followers()}
      </p>
      {#each otherCandidates as candidate (candidate.profile.id)}
        <CollaboratorRow
          {candidate}
          isPending={$pendingUserId === candidate.profile.id}
          onToggle={() => handleToggle(candidate)}
        />
      {/each}
    {/if}
  {/if}
</Drawer>

<style lang="scss">
  .empty-state {
    padding: var(--gap-m);
  }

  .section-title {
    padding-inline: var(--gap-m);
  }

  .has-divider {
    position: relative;

    padding-block-start: var(--gap-m);

    &::before {
      content: "";

      position: absolute;
      inset-block-start: 0;
      inset-inline: var(--gap-m);

      height: var(--ni-2);

      background: radial-gradient(
        60% 100% at 50% 50%,
        color-mix(in srgb, var(--color-foreground) 20%, transparent),
        transparent 70%
      );
    }
  }
</style>
