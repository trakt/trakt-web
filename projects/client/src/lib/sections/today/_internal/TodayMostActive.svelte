<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import type { TodayPersonGroup } from "../models/TodayPersonGroup.ts";

  const MAX_PEOPLE = 5;

  const { groups, onOpen }: {
    groups: ReadonlyArray<TodayPersonGroup>;
    onOpen: (key: string) => void;
  } = $props();

  const people = $derived(
    groups
      .toSorted((a, b) => b.actions.length - a.actions.length)
      .slice(0, MAX_PEOPLE),
  );
  const mostActions = $derived(people.at(0)?.actions.length ?? 1);
</script>

{#if people.length > 0}
  <section class="trakt-today-most-active">
    <ul>
      {#each people as group, index (group.key)}
        <li style="--activity-share: {group.actions.length / mostActions}">
          <span class="tag bold secondary person-rank">{index + 1}</span>
          <UserAvatar user={group.user} size="small" />
          <button class="person-button" onclick={() => onOpen(group.key)}>
            <span class="person-line">
              <span class="bold ellipsis person-name">
                {toDisplayableName(group.user)}
              </span>
              <span class="small secondary no-wrap">
                {group.actions.length === 1
                  ? m.text_today_stories_one()
                  : m.text_today_stories_other({
                    count: group.actions.length,
                  })}
              </span>
            </span>
            <span class="person-activity" aria-hidden="true"></span>
          </button>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-today-most-active {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--gap-m);
    border-radius: var(--border-radius-xl);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);

    ul {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);

      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: flex;
      align-items: center;
      gap: var(--gap-s);

      padding: var(--gap-xs);
      margin-inline: calc(-1 * var(--gap-xs));
      border-radius: var(--border-radius-m);

      transition: background var(--transition-increment) ease-in-out;

      @include for-mouse {
        &:hover {
          background: color-mix(
            in srgb,
            var(--color-foreground) 5%,
            transparent
          );
        }
      }
    }

    .person-rank {
      min-width: var(--ni-12);
      text-align: center;
      font-variant-numeric: tabular-nums;
    }

    li:first-child .person-rank {
      color: var(--color-text-emphasis);
    }

    .person-button {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: var(--ni-6);
      min-width: 0;

      padding: 0;
      border: 0;
      background: transparent;
      color: inherit;
      text-align: start;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .person-line {
      display: flex;
      align-items: baseline;
      gap: var(--gap-s);
      width: 100%;

      .person-name {
        flex-grow: 1;
        min-width: 0;
      }
    }

    .person-activity {
      position: relative;
      width: 100%;
      height: var(--ni-4);

      border-radius: var(--border-radius-xxl);
      background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
      overflow: hidden;

      &::after {
        content: "";
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: calc(var(--activity-share) * 100%);

        border-radius: inherit;
        background: linear-gradient(
          90deg,
          var(--purple-400),
          var(--purple-600)
        );
      }
    }
  }
</style>
