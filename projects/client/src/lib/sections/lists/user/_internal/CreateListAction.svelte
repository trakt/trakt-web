<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { usePersonalListsSummary } from "../usePersonalListsSummary";
  import AddNewListButton from "./CreateListButton.svelte";
  import ListUpsellLink from "./ListUpsellLink.svelte";

  const { user } = useUser();
  const { lists, isLoading } = usePersonalListsSummary({ type: "personal" });

  const isAtLimit = $derived(
    !$isLoading && $lists.length >= $user.limits.lists.limit,
  );
</script>

{#if isAtLimit}
  <ListUpsellLink />
{:else}
  <AddNewListButton isLoading={$isLoading} />
{/if}
