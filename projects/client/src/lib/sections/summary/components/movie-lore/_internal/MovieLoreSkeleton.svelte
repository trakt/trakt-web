<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  const LEAD_LINE_WIDTHS = ["100%", "92%", "58%"];
  const REST_LINE_WIDTHS = ["100%", "94%", "100%", "72%"];
  const NOTE_LINE_WIDTHS = ["100%", "68%"];
  const POSTER_PLACEHOLDERS = [0, 1, 2];
</script>

<div class="trakt-movie-lore-skeleton" aria-hidden="true">
  <RenderFor audience="authenticated">
    <Skeleton height="var(--ni-128)" radius="var(--border-radius-l)" />
  </RenderFor>
  <RenderFor audience="public">
    <Skeleton height="var(--ni-56)" radius="var(--border-radius-l)" />
  </RenderFor>

  <Skeleton height="var(--ni-40)" radius="var(--border-radius-pill)" />

  <div class="skeleton-setup">
    <div class="skeleton-lead">
      {#each LEAD_LINE_WIDTHS as width, index (index)}
        <div class="skeleton-lead-line">
          <Skeleton {width} height="var(--ni-20)" />
        </div>
      {/each}
    </div>
    <div class="skeleton-rest">
      {#each REST_LINE_WIDTHS as width, index (index)}
        <div class="skeleton-rest-line">
          <Skeleton {width} height="var(--ni-14)" />
        </div>
      {/each}
    </div>
  </div>

  <div class="skeleton-section">
    <div class="skeleton-heading">
      <Skeleton width="var(--ni-160)" height="var(--ni-18)" />
    </div>
    <div class="skeleton-card">
      <Skeleton
        width="var(--ni-160)"
        height="var(--ni-20)"
        radius="var(--border-radius-pill)"
      />
      <div class="skeleton-note">
        {#each NOTE_LINE_WIDTHS as width, index (index)}
          <div class="skeleton-rest-line">
            <Skeleton {width} height="var(--ni-14)" />
          </div>
        {/each}
      </div>
      <div class="skeleton-posters">
        {#each POSTER_PLACEHOLDERS as placeholder (placeholder)}
          <Skeleton
            width="var(--width-portrait-card)"
            height="calc(var(--height-portrait-card-cover) + var(--ni-64))"
            radius="var(--border-radius-m)"
          />
        {/each}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .trakt-movie-lore-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--ni-28);

    .skeleton-setup {
      display: flex;
      flex-direction: column;
      gap: var(--ni-10);
    }

    .skeleton-lead-line {
      display: flex;
      align-items: center;
      height: var(--ni-28);
    }

    .skeleton-rest {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);
    }

    .skeleton-rest-line {
      display: flex;
      align-items: center;
      height: var(--ni-22);
    }

    .skeleton-section {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }

    .skeleton-card {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
      padding: var(--gap-m);
      border-radius: var(--border-radius-l);
      background: var(--recap-card-background);
    }

    .skeleton-note {
      display: flex;
      flex-direction: column;
    }

    .skeleton-posters {
      display: flex;
      gap: var(--gap-s);
      padding-block: var(--gap-xs);
      overflow: hidden;

      > :global(*) {
        flex-shrink: 0;
      }
    }

    .skeleton-heading {
      display: flex;
      align-items: center;

      min-height: var(--ni-32);
    }
  }
</style>
