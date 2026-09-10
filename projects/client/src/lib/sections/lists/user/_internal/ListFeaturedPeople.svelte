<script lang="ts">
  import PeopleIcon from "$lib/components/icons/PeopleIcon.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import FeaturedPeopleSearchList from "./FeaturedPeopleSearchList.svelte";
  import { useFeaturedPeople } from "./useFeaturedPeople.ts";

  const SKELETON_COUNT = 4;

  const { listId }: { listId: number } = $props();

  const { people, isLoading } = useFeaturedPeople(fromRune(() => listId));

  const isInitialLoading = $derived($isLoading && $people.length === 0);
</script>

<section class="trakt-list-featured-people">
  <span class="bold secondary">{m.list_title_featured_people()}</span>

  {#if isInitialLoading}
    <div class="featured-skeleton" aria-busy="true">
      {#each Array.from({ length: SKELETON_COUNT }, (_, index) => index) as index (index)}
        <Skeleton height="var(--ni-56)" radius="var(--border-radius-m)" />
      {/each}
    </div>
  {:else if $people.length === 0}
    <div class="featured-empty">
      <span class="empty-icon" aria-hidden="true"><PeopleIcon /></span>
      <div class="empty-text">
        <span class="bold">{m.text_no_featured_people()}</span>
        <span class="secondary small">{m.text_featured_people_empty_hint()}</span>
      </div>
    </div>
  {:else}
    <FeaturedPeopleSearchList people={$people} />
  {/if}
</section>

<style lang="scss">
  .trakt-list-featured-people {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    .featured-skeleton {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }

    .featured-empty {
      display: flex;
      align-items: center;
      gap: var(--gap-s);

      padding: var(--ni-16);
      border-radius: var(--border-radius-m);
      background: color-mix(in srgb, var(--color-foreground) 4%, transparent);

      .empty-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;

        width: var(--ni-40);
        height: var(--ni-40);
        border-radius: 50%;

        color: var(--color-text-secondary);
        background: color-mix(in srgb, var(--color-foreground) 8%, transparent);

        :global(svg) {
          width: var(--ni-20);
          height: var(--ni-20);
        }
      }

      .empty-text {
        display: flex;
        flex-direction: column;
        gap: var(--gap-xxs);
        min-width: 0;
      }
    }
  }
</style>
