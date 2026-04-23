<script lang="ts">
  import { useQuery } from "$lib/features/query/useQuery";
  import * as m from "$lib/features/i18n/messages.ts";
  import { blockedUsersQuery } from "$lib/requests/queries/users/blockedUsersQuery";
  import { map } from "rxjs";
  import BlockedUserRow from "./_internal/BlockedUserRow.svelte";
  import SettingsBlock from "./_internal/SettingsBlock.svelte";

  const blockedUsers = useQuery(blockedUsersQuery()).pipe(
    map((query) => query.data ?? []),
  );
</script>

<div class="trakt-blocked-users-settings">
  <SettingsBlock
    title={m.heading_blocked_users()}
    description={m.description_blocked_users()}
  >
    {#if $blockedUsers.length === 0}
      <p class="secondary">{m.text_no_blocked_users()}</p>
    {:else}
      <div class="trakt-blocked-users-list">
        {#each $blockedUsers as profile (profile.key)}
          <BlockedUserRow {profile} />
        {/each}
      </div>
    {/if}
  </SettingsBlock>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-blocked-users-settings {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxl);

    max-width: var(--ni-480);

    @include for-tablet-sm-and-below {
      max-width: 100%;
    }
  }

  .trakt-blocked-users-list {
    display: flex;
    flex-direction: column;

    :global(.trakt-blocked-user-row:not(:last-child)) {
      border-bottom: var(--border-thickness-xxs) solid
        color-mix(in srgb, var(--color-foreground) 10%, transparent);
    }
  }
</style>
