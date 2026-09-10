<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DrawerSearchInput from "$lib/components/drawer/DrawerSearchInput.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary.ts";
  import FeaturedPersonItem from "./FeaturedPersonItem.svelte";

  const { people, onClose }: {
    people: PersonSummary[];
    onClose: () => void;
  } = $props();

  let isOpen = $state(false);
  let searchTerm = $state("");
  const normalizedSearchTerm = $derived(searchTerm.trim().toLocaleLowerCase());
  const visiblePeople = $derived(
    people.filter(({ name }) => name.toLocaleLowerCase().includes(normalizedSearchTerm)),
  );
</script>

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.list_title_featured_people()}
  size="large"
  headerVariant="overlay"
>
  {#if isOpen}
    <div class="trakt-featured-people-drawer">
      <DrawerSearchInput
        bind:value={searchTerm}
        label={m.input_label_search_credit_members()}
        placeholder={m.input_placeholder_search_credit_members()}
      />
      {#if visiblePeople.length > 0}
        <div class="people-list" role="list">
          {#each visiblePeople as person (person.key)}
            <FeaturedPersonItem {person} variant="summary" />
          {/each}
        </div>
      {:else}
        <p class="secondary">{m.list_placeholder_no_filter_results()}</p>
      {/if}
    </div>
  {/if}
</Drawer>

<style>
  .trakt-featured-people-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    .people-list {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }
  }
</style>
