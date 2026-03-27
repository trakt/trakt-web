<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import { useFollowing } from "../stores/useFollowing";
  import ProfileCard from "./ProfileCard.svelte";

  const {
    slug,
  }: {
    slug: string;
  } = $props();

  const { current, set, options } = useToggler("social");
  const { profiles, isLoading } = $derived(useFollowing(slug, $current.value));

  const placeholder = $derived(
    $current.value === "following"
      ? m.list_placeholder_following()
      : m.list_placeholder_followers(),
  );
</script>

{#snippet metaInfo()}
  <ListMetaInfo text={$current.text()} />
{/snippet}

<GridList
  id={`profiles-paginated-list-${slug}-${$current.value}`}
  items={$profiles}
  title={m.list_title_social()}
  {metaInfo}
  sizing="auto"
  --width-item="var(--ni-148)"
>
  {#snippet item(profile)}
    <ProfileCard {profile} />
  {/snippet}

  {#snippet actions()}
    <Toggler value={$current.value} onChange={set} {options} />
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      {placeholder}
    {:else}
      <LoadingIndicator />
    {/if}
  {/snippet}
</GridList>
