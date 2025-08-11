<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import VipBadge from "$lib/sections/navbar/components/VIPBadge.svelte";
  import UserAvatar from "../../UserAvatar.svelte";
  import type { CtaItemIntl } from "../CtaItemIntl";
  import CtaCard from "./CtaCard.svelte";
  import { useTraktTeam } from "./useTraktTeam";

  const { intl }: { intl: CtaItemIntl } = $props();

  const { network } = useUser();
  const { isLoading, team } = $derived(useTraktTeam($network?.following ?? []));
</script>

<CtaCard variant="activity">
  <p class="smaller">
    {intl.text({ cta: "activity" })}
  </p>
  <div class="trakt-team-list">
    {#if !$isLoading}
      {#each $team as member (member.username)}
        <div class="trakt-team-member">
          <UserAvatar user={member}>
            {#snippet icon()}
              <VipBadge style="inverted" />
            {/snippet}
          </UserAvatar>
        </div>
      {/each}
    {/if}
  </div>
</CtaCard>

<style>
  .trakt-team-list {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: var(--gap-xs);
  }

  .trakt-team-member {
    position: relative;

    :global(svg) {
      width: var(--ni-22);
      height: var(--ni-22);

      position: absolute;
      top: var(--ni-neg-8);
      right: var(--ni-neg-4);
    }
  }
</style>
