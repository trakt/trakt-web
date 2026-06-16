<script lang="ts">
  import GlobeIcon from "$lib/components/icons/GlobeIcon.svelte";
  import { m } from "$lib/paraglide/messages";

  const {
    joinYear,
  }: {
    joinYear: number | null;
  } = $props();
</script>

<div class="trakt-yir-2024-membership">
  <div class="yir-2024-trakt-worldwide">
    <span class="bold yir-2024-membership-label">
      {m.yir_2024_trakt_worldwide()}
    </span>
    <span class="yir-2024-globe"><GlobeIcon /></span>
  </div>
  <div class="yir-2024-member" class:is-empty={joinYear === null}>
    {#if joinYear !== null}
      <span class="bold yir-2024-member-year">{joinYear}</span>
      <span class="bold yir-2024-membership-label">
        {m.yir_2024_member_since()}
      </span>
    {/if}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  // 6-column grid that mirrors the 6-poster wave above. Placing the label
  // blocks in columns 2 and 5 (centered within them) lines them up exactly
  // under poster 2 and poster 5.
  .trakt-yir-2024-membership {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    align-items: center;
    column-gap: var(--gap-m);
    width: 100%;
    margin-top: var(--ni-neg-24);
    color: var(--shade-300);
    box-sizing: border-box;

    // Tablet-sm-and-below: collapse to a centered flex row so the two
    // labels sit together in the middle of the page with a small gap
    // between them, instead of being pinned to opposite edges.
    @include for-tablet-sm-and-below {
      display: flex;
      justify-content: center;
      gap: var(--gap-xl);
      margin-top: var(--ni-16);
    }

    @include for-mobile {
      gap: var(--gap-m);
    }
  }

  .yir-2024-trakt-worldwide,
  .yir-2024-member {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-s);
    text-transform: uppercase;
    justify-self: center;
  }

  .yir-2024-trakt-worldwide {
    grid-column: 2;
  }

  .yir-2024-member {
    grid-column: 5;
  }

  // Spacer when the user has no joinedAt — keeps space-between balanced.
  .yir-2024-member.is-empty {
    visibility: hidden;
  }

  // Member block: stacked "Member / Since" labels left-aligned, year on the
  // right side and right-aligned within itself.
  .yir-2024-trakt-worldwide .yir-2024-membership-label {
    text-align: end;
  }

  .yir-2024-member .yir-2024-membership-label {
    text-align: start;
  }

  .yir-2024-membership-label {
    font-size: var(--ni-16);
    max-width: var(--ni-104);

    @include for-mobile {
      font-size: var(--ni-12);
      max-width: var(--ni-72);
    }
  }

  .yir-2024-globe {
    display: inline-flex;

    :global(svg) {
      width: var(--ni-44);
      height: var(--ni-44);
      color: var(--shade-300);
    }

    @include for-mobile {
      :global(svg) {
        width: var(--ni-28);
        height: var(--ni-28);
      }
    }
  }

  .yir-2024-member-year {
    font-size: var(--ni-44);
    color: var(--shade-300);
    text-align: end;

    @include for-mobile {
      font-size: var(--ni-28);
    }
  }
</style>
