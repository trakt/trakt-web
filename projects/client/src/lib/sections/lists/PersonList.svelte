<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import DefaultPersonItem from "./components/DefaultPersonItem.svelte";

  type CastListProps = {
    title: string;
    people: PersonSummary[];
  };

  const { title, people }: CastListProps = $props();
</script>

<SectionList
  id={`person-list`}
  items={people}
  {title}
  --height-list="var(--height-person-list)"
>
  {#snippet item(person)}
    <DefaultPersonItem {person} />
  {/snippet}
</SectionList>
