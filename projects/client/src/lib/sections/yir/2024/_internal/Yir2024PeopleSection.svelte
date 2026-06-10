<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import Yir2024PeopleColumn from "./Yir2024PeopleColumn.svelte";

  type Yir2024PeopleSectionProps = {
    slug: string;
    year: number;
  };

  const { slug, year }: Yir2024PeopleSectionProps = $props();
</script>

<section class="yir-2024-people" id="section-people">
  <div class="yir-2024-people-grid">
    <div class="yir-2024-people-cell">
      <Yir2024PeopleColumn
        {slug}
        {year}
        type="actors"
        title={m.yir_2024_people_actors()}
      />
    </div>
    <div class="yir-2024-people-cell">
      <Yir2024PeopleColumn
        {slug}
        {year}
        type="actresses"
        title={m.yir_2024_people_actresses()}
      />
    </div>
    <div class="yir-2024-people-cell">
      <Yir2024PeopleColumn
        {slug}
        {year}
        type="directors"
        title={m.yir_2024_people_directors()}
      />
    </div>
    <div class="yir-2024-people-cell">
      <Yir2024PeopleColumn
        {slug}
        {year}
        type="writers"
        title={m.yir_2024_people_writers()}
      />
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  // Same radial-gradient wrapper as the stats graph panels.
  .yir-2024-people {
    --people-divider: var(--shade-1000);

    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    border-radius: var(--ni-64);
    padding: var(--ni-44);
    background: radial-gradient(
      50% 39.27% at 50% 0%,
      color-mix(in srgb, var(--shade-950) 90%, var(--blue-500) 10%) 0%,
      color-mix(in srgb, var(--shade-950) 70%, var(--shade-900) 30%) 100%
    );

    @include for-mobile {
      border-radius: var(--ni-32);
      padding: var(--ni-20);
    }
  }

  // Two columns × two rows on desktop; single column once stacked.
  .yir-2024-people-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .yir-2024-people-cell {
    min-width: 0;
  }

  // Vertical divider between the two columns (pad each side toward the line).
  .yir-2024-people-cell:nth-child(odd) {
    padding-right: var(--ni-48);
    border-right: var(--border-thickness-xs) solid var(--people-divider);
  }

  .yir-2024-people-cell:nth-child(even) {
    padding-left: var(--ni-48);
  }

  // Horizontal divider between the two rows.
  .yir-2024-people-cell:nth-child(1),
  .yir-2024-people-cell:nth-child(2) {
    padding-bottom: var(--ni-44);
    border-bottom: var(--border-thickness-xs) solid var(--people-divider);
  }

  .yir-2024-people-cell:nth-child(3),
  .yir-2024-people-cell:nth-child(4) {
    padding-top: var(--ni-44);
  }

  // Stacked: drop the vertical divider, keep horizontal dividers between all.
  @include for-tablet-sm-and-below {
    .yir-2024-people-cell:nth-child(odd) {
      padding-right: 0;
      border-right: none;
    }

    .yir-2024-people-cell:nth-child(even) {
      padding-left: 0;
    }

    .yir-2024-people-cell:nth-child(1) {
      padding-bottom: var(--ni-32);
    }

    .yir-2024-people-cell:nth-child(2) {
      padding-top: var(--ni-32);
      padding-bottom: var(--ni-32);
    }

    .yir-2024-people-cell:nth-child(3) {
      padding-top: var(--ni-32);
      padding-bottom: var(--ni-32);
      border-bottom: var(--border-thickness-xs) solid var(--people-divider);
    }

    .yir-2024-people-cell:nth-child(4) {
      padding-top: var(--ni-32);
    }
  }
</style>
