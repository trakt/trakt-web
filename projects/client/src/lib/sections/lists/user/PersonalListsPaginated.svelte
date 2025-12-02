<script lang="ts">
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { DEFAULT_LISTS_DRILL_SIZE } from "$lib/utils/constants";
  import type { PersonalListType } from "./models/PersonalListType";
  import { usePersonalListsSummary } from "./usePersonalListsSummary";
  import UserList from "./UserList.svelte";

  const { slug, type }: { slug: string; type: PersonalListType } = $props();

  const { mode } = useDiscover();
</script>

<PaginatedList
  {type}
  id={`view-all-personal-lists-${type}-${$mode}`}
  useList={(params) =>
    usePersonalListsSummary({
      ...params,
      slug,
      limit: DEFAULT_LISTS_DRILL_SIZE,
    })}
>
  {#snippet items(items)}
    {#each items as list (list.id)}
      <UserList {list} type={$mode} />
    {/each}
  {/snippet}
</PaginatedList>
