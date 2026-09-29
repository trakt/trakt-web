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
</script>

{#if people.length > 0}
  <section class="trakt-today-most-active">
    <h3>{m.text_today_most_active()}</h3>
    <ul>
      {#each people as group (group.key)}
        <li>
          <UserAvatar user={group.user} size="small" />
          <button class="person-button" onclick={() => onOpen(group.key)}>
            <span class="bold ellipsis person-name">
              {toDisplayableName(group.user)}
            </span>
            <span class="small secondary">
              {group.actions.length === 1
                ? m.text_today_stories_one()
                : m.text_today_stories_other({ count: group.actions.length })}
            </span>
          </button>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style>
  .trakt-today-most-active {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    h3 {
      margin: 0;
    }

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
    }

    .person-button {
      display: flex;
      flex-grow: 1;
      align-items: center;
      gap: var(--gap-s);
      min-width: 0;

      padding: 0;
      border: 0;
      background: transparent;
      color: inherit;
      text-align: start;
      cursor: pointer;

      .person-name {
        flex-grow: 1;
        min-width: 0;
      }
    }
  }
</style>
