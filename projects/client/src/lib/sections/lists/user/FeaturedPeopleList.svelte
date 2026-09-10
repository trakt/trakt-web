<script lang="ts">
  import { page } from "$app/state";
  import { DRAWER_VIEW_PARAM } from "$lib/components/drawer/constants/index.ts";
  import { drawerNavigation } from "$lib/components/drawer/drawerNavigation.ts";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import PersonCard from "$lib/components/people/card/PersonCard.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { listFeaturedPeopleQuery } from "$lib/requests/queries/lists/listFeaturedPeopleQuery.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { map } from "rxjs";
  import FeaturedPeopleDrawer from "./_internal/FeaturedPeopleDrawer.svelte";
  import FeaturedPersonItem from "./_internal/FeaturedPersonItem.svelte";

  const { listId }: { listId: number } = $props();

  const query = useQuery(
    fromRune(() => listId).pipe(map((listId) => listFeaturedPeopleQuery({ listId }))),
  );
  const people = $derived($query.data ?? []);
  const { buildDrawerLink, close } = drawerNavigation<"featured-people">();
  const drilldown = $derived(buildDrawerLink("featured-people"));
  const isDrawerOpen = $derived(
    page.url.searchParams.get(DRAWER_VIEW_PARAM) === "featured-people",
  );
</script>

{#if people.length > 0}
  <div class="trakt-featured-people-list">
    <SectionList
      id={{ scope: "featured-people", key: `${listId}` }}
      title={m.list_title_featured_people()}
      items={people}
      drilldown={{
        ...drilldown,
        source: { id: "featured-people" },
        label: m.button_text_view_all(),
      }}
      --height-list="var(--height-person-list)"
    >
      {#snippet item(person)}
        <PersonCard>
          <FeaturedPersonItem {person} />
        </PersonCard>
      {/snippet}
    </SectionList>
  </div>

  {#if isDrawerOpen}
    <FeaturedPeopleDrawer {people} onClose={close} />
  {/if}
{/if}

<style>
  .trakt-featured-people-list {
    padding-block-start: var(--gap-xxl);
  }
</style>
