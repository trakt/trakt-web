<script lang="ts">
  import MessageWithBold from "$lib/components/text/MessageWithBold.svelte";
  import { m } from "$lib/paraglide/messages";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import Yir2024PostersRow from "./Yir2024PostersRow.svelte";

  type Yir2024ThanksSectionProps = {
    shows: MediaEntry[];
    movies: MediaEntry[];
    year: number;
  };

  const { shows, movies, year }: Yir2024ThanksSectionProps = $props();

  // First three shows + first three movies, in a single staggered row.
  const posters = $derived([...shows.slice(0, 3), ...movies.slice(0, 3)]);
  const nextYear = $derived(year + 1);
</script>

<section class="yir-2024-thanks" id="section-thanks">
  <div class="yir-2024-thanks-grid">
    <h2 class="bold yir-2024-thanks-intro">{m.yir_2024_thanks_intro()}</h2>
    <p class="bold yir-2024-thanks-title">{m.yir_2024_thanks_title()}</p>

    <div class="yir-2024-thanks-copy">
      <p>
        <MessageWithBold
          message={m.yir_2024_thanks_copy_directed({ year, nextYear })}
        />
      </p>
      <p>{m.yir_2024_thanks_copy_recommend()}</p>
    </div>
  </div>

  <Yir2024PostersRow entries={posters} />
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-2024-thanks {
    width: 100%;
    color: var(--shade-10);
    // Last section on the page — keep a gap below the posters so they don't
    // butt up against the page edge.
    padding-bottom: var(--ni-72);
  }

  // "But most importantly…" sits above the huge "thanks!"; the copy lines up
  // with "thanks!" (the second row), not the intro. The left column is wider
  // so "thanks!" has room to dominate. Stacks on smaller screens.
  .yir-2024-thanks-grid {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-areas:
      "intro ."
      "title copy";
    column-gap: var(--ni-48);
    align-items: start;
    // Large gap between the headline/copy and the poster row below.
    margin-bottom: var(--ni-120);

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas:
        "intro"
        "title"
        "copy";
      row-gap: var(--ni-20);
    }

    // Tighter gap to the posters on phones.
    @include for-mobile {
      margin-bottom: var(--ni-32);
    }
  }

  .yir-2024-thanks-intro {
    grid-area: intro;
    margin: 0;
    font-size: clamp(var(--ni-28), 4vw, var(--ni-48));
    line-height: 1.1;
  }

  // Huge purple wordmark, mirroring the hero's gradient-clipped label.
  .yir-2024-thanks-title {
    grid-area: title;
    margin: 0;
    font-size: clamp(var(--ni-64), 12vw, var(--ni-160));
    line-height: 1;
    letter-spacing: -0.04em;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--purple-300) 85%, white) 0%,
      var(--purple-500) 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    // Single column on phones — let "thanks!" fill the width.
    @include for-mobile {
      font-size: 26vw;
    }
  }

  .yir-2024-thanks-copy {
    grid-area: copy;
    display: flex;
    flex-direction: column;
    gap: var(--ni-20);
    text-align: left;
    color: var(--shade-10);

    // Set on the <p> directly — a global `p { font-size }` rule beats the
    // value the paragraph would otherwise inherit from this container.
    p {
      margin: 0;
      font-size: var(--ni-24);
      line-height: 1.45;

      @include for-mobile {
        font-size: var(--ni-20);
      }
    }
  }
</style>
