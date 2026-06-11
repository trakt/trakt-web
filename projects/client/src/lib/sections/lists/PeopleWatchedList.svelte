<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
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
    --height-list="var(--ni-48)"
  >
    {#snippet item(user)}
      <Tooltip content={toDisplayableName(user)}>
        <UserAvatar {user} size="large" />
      </Tooltip>
    {/snippet}
  </SectionList>
{/if}
