<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { getIntlLocale, languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { userStatsQuery } from "$lib/requests/queries/users/userStatsQuery.ts";
  import type { ConfirmationContentProps } from "./ConfirmationContentProps.ts";
  import { toDeleteAccountStats } from "./toDeleteAccountStats.ts";

  const _props: ConfirmationContentProps = $props();

  const { user } = useUser();
  const stats = useQuery(userStatsQuery({ slug: "me" }));

  const format = $derived(new Intl.NumberFormat(getIntlLocale(languageTag())));
  const counts = $derived(
    toDeleteAccountStats({
      joinedAt: $user?.joinedAt,
      stats: $stats.data,
      now: new Date(),
    }),
  );

  const tiles = $derived(
    [
      {
        key: "years",
        label: m.label_delete_account_stat_years(),
        value: counts.years,
        isLoading: false,
      },
      {
        key: "hours",
        label: m.label_delete_account_stat_hours(),
        value: counts.hours,
        isLoading: $stats.isLoading,
      },
      {
        key: "plays",
        label: m.label_delete_account_stat_plays(),
        value: counts.plays,
        isLoading: $stats.isLoading,
      },
    ].filter((tile) => tile.isLoading || tile.value !== null),
  );
</script>

{#if tiles.length > 0}
  <dl class="trakt-delete-account-stats">
    {#each tiles as tile (tile.key)}
      <div class="stat-tile">
        <dt class="small secondary">{tile.label}</dt>
        <dd class="bold">
          {#if tile.isLoading}
            <Skeleton width="var(--ni-40)" height="1lh" />
          {:else if tile.value !== null}
            {format.format(tile.value)}
          {/if}
        </dd>
      </div>
    {/each}
  </dl>
{/if}

<style lang="scss">
  .trakt-delete-account-stats {
    display: flex;
    margin: 0;

    box-sizing: border-box;

    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-text-primary) 8%, transparent);
    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--color-text-primary) 3%, transparent);
  }

  .stat-tile {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    gap: var(--ni-4);

    padding: var(--gap-s) var(--gap-xs);

    text-align: center;

    + .stat-tile {
      border-inline-start: var(--border-thickness-xxs) solid
        color-mix(in srgb, var(--color-text-primary) 8%, transparent);
    }

    dt,
    dd {
      margin: 0;
    }

    dd {
      display: flex;
      justify-content: center;

      min-width: var(--ni-40);

      font-variant-numeric: tabular-nums;
      color: var(--color-foreground-purple);
    }
  }
</style>
