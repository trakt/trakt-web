<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import UserAvatar from "./components/UserAvatar.svelte";

  type PeopleWatchedListProps = {
    slug: string;
    watchers: UserProfile[];
  };

  const { slug, watchers }: PeopleWatchedListProps = $props();
</script>

{#if watchers.length > 0}
  <SectionList
    id={{ scope: "people-watched", key: slug }}
    items={watchers}
    title={m.list_title_people_watched()}
    --height-list="var(--ni-64)"
  >
    {#snippet item(user)}
      <div class="people-watched-item">
        <UserAvatar {user} size="small" />
        <p class="bold ellipsis">{toDisplayableName(user)}</p>
      </div>
    {/snippet}
  </SectionList>
{/if}

<style lang="scss">
  .people-watched-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xs);
    width: var(--ni-56);
  }
</style>
