<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    id,
    label,
    count,
  }: {
    id: string;
    label: string;
    count: number;
  } = $props();

  const peopleCount = $derived(
    count === 1
      ? m.text_person_count({ count })
      : m.text_people_count({ count }),
  );
</script>

<div {id} class="trakt-list-header" role="heading" aria-level="2">
  <div class="trakt-list-header-content">
    <div class="trakt-list-title">
      <div class="trakt-list-title-wrapper">
        <span class="bold ellipsis">
          {label}
        </span>
        <span class="small secondary ellipsis">
          {peopleCount}
        </span>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .trakt-list-header {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    margin: 0;
    min-height: var(--ni-40);
    height: var(--ni-40);

    user-select: none;
  }

  .trakt-list-title,
  .trakt-list-header-content,
  .trakt-list-title-wrapper {
    display: flex;
    min-width: 0;
  }

  .trakt-list-title-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }

  .trakt-list-title {
    align-items: center;
    gap: var(--gap-xs);
  }

  .trakt-list-header-content {
    justify-content: space-between;
    width: 100%;
  }
</style>
