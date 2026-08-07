<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { ReportableType } from "$lib/features/report/models/ReportableType.ts";
  import ReportButton from "$lib/features/report/ReportButton.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import { toTranslatedPosition } from "$lib/utils/formatting/string/toTranslatedPosition";
  import SummaryOverview from "../summary/SummaryOverview.svelte";
  import SummaryHeaderFacts from "../header-kit/SummaryHeaderFacts.svelte";
  import SummaryHeaderTitle from "../header-kit/SummaryHeaderTitle.svelte";
  import { mapToPersonFacts } from "./_internal/mapToPersonFacts.ts";
  import { page } from "$app/state";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import PersonMastheadBackdrop from "./_internal/PersonMastheadBackdrop.svelte";
  import {
    PERSON_BACKDROP_PARAM,
    toPersonBackdropVariant,
  } from "./_internal/PersonBackdropVariant.ts";
  import { usePersonBackdropMedia } from "./_internal/usePersonBackdropMedia.ts";
  import { usePersonCreditCounts } from "./_internal/usePersonCreditCounts.ts";
  import { mapToPersonStats } from "./_internal/mapToPersonStats.ts";
  import {
    PERSON_STATS_PARAM,
    toPersonStatsLayout,
  } from "./_internal/PersonStatsLayout.ts";
  import PersonMastheadStats from "./_internal/PersonMastheadStats.svelte";
  /*
    Imported the same way this folder's sibling PeopleSummary already imports them.
    If this treatment graduates, these three belong one level up in `people/` -
    they are shared by three headers now, not private to v2.
  */
  import ImdbLink from "./v2/_internal/ImdbLink.svelte";
  import SocialMediaLinks from "./v2/_internal/SocialMediaLinks.svelte";
  import { hasSocialMediaLinks } from "./v2/_internal/hasSocialMediaLinks";

  /*
    The people page given the masthead treatment: headshot centre stage, name as
    the masthead, biography as the deck, and the facts about the person - birth,
    age, height - centred beneath it with their socials.

    Two deliberate departures from the media masthead:

    - The backdrop is borrowed, not owned. A person carries no artwork of their
      own, so what sits behind them is an open question - three candidates are
      wired up behind `?backdrop=`, see PersonBackdropVariant. Default is none.
    - The facts sit in ONE centred row rather than a left-aligned strip. On a
      title the strip earns its left alignment by holding four or five columns of
      different kinds of data; a person has three short facts, and centring them
      keeps them part of the masthead rather than a data table under it.
  */
  const { person }: { person: PersonSummary } = $props();

  /*
    Which backdrop treatment to show. Defaults to the headshot - the chosen option,
    and the only one that cannot fail, since a person always has one where the
    others depend on their credits carrying artwork.

    The param stays so `?backdrop=credit|colors|none` still reaches the alternatives:
    the comparison that settled this remains one URL away rather than deleted.
  */
  const backdropVariant = $derived(
    toPersonBackdropVariant(page.url.searchParams.get(PERSON_BACKDROP_PARAM)),
  );

  const slug$ = fromRune(() => person.slug);
  const backdropMedia = usePersonBackdropMedia(slug$);
  const creditCounts = usePersonCreditCounts(slug$);

  const facts = $derived(mapToPersonFacts({ person, now: new Date() }));
  const stats = $derived(
    mapToPersonStats({ slug: person.slug, credits: $creditCounts }),
  );

  /*
    Where the stats sit - `?stats=below` returns them to their own line. Flanking
    the portrait costs no height and uses the band's empty sides, so it leads.
  */
  const statsLayout = $derived(
    toPersonStatsLayout(page.url.searchParams.get(PERSON_STATS_PARAM)),
  );
  const isFlanked = $derived(statsLayout === "flank" && stats.length > 0);

  /*
    Whether a band is actually drawn. Without one there is nothing to overlap, so
    the content must not be pulled upwards - it would leave the card entirely.
  */
  const hasBackdrop = $derived.by(() => {
    if (backdropVariant === "headshot") return true;
    if (backdropVariant === "none") return false;
    return $backdropMedia != null;
  });
</script>

{#snippet tags()}
  {#if person.imdb}
    <ImdbLink imdbId={person.imdb} />
  {/if}
{/snippet}

<article
  class="trakt-people-masthead-header"
  data-has-backdrop={hasBackdrop}
>
  {#if hasBackdrop}
    <div class="masthead-backdrop">
      <PersonMastheadBackdrop
        variant={backdropVariant}
        {person}
        media={$backdropMedia}
      />
    </div>
  {/if}

  <div class="masthead-content">
    <div class="masthead-crown" data-flanked={isFlanked}>
      {#if isFlanked}
        <div class="crown-flank" data-side="start">
          <PersonMastheadStats
            stats={stats.slice(0, 1)}
            name={person.name}
            orientation="stacked"
          />
        </div>
      {/if}

      <div class="masthead-portrait">
        <SummaryPoster
          src={person.headshot.url.medium}
          alt={person.name}
          {tags}
        />
      </div>

      {#if isFlanked}
        <div class="crown-flank" data-side="end">
          <PersonMastheadStats
            stats={stats.slice(1)}
            name={person.name}
            orientation="stacked"
          />
        </div>
      {/if}
    </div>

  {#if person.knownFor}
    <span class="masthead-kicker">{toTranslatedPosition(person.knownFor)}</span>
  {/if}

  <SummaryHeaderTitle title={person.name} />

  <!--
    Facts, socials and the actions share ONE row. Stacked, they read as four
    separate bands under the name and pushed the biography off the fold; the facts
    also wrapped mid-row, leaving a separator with nothing after it.

    The facts use the summary header's own fact component in its inline form, so
    the type scale is inherited rather than restated - and inline means no labels,
    which is why mapToPersonFacts makes each value self-describing.
  -->
  <div class="masthead-meta">
    <SummaryHeaderFacts {facts} variant="inline" />
  </div>

  <div class="masthead-links">
    {#if hasSocialMediaLinks(person)}
      <SocialMediaLinks {person} />
      <span class="meta-divider" aria-hidden="true"></span>
    {/if}

    <ShareButton
      title={person.name}
      textFactory={({ title: name }) => m.text_share_person({ name })}
      source={{ id: "person" }}
    />

    <RenderFor audience="authenticated">
      <PopupMenu
        label={m.button_label_popup_menu({ title: person.name })}
        mode="standalone"
        size="normal"
        title={person.name}
      >
        {#snippet items()}
          <ReportButton
            params={{
              type: ReportableType.Person,
              id: person.id,
              title: person.name,
            }}
            label={m.button_label_report_person({ name: person.name })}
          />
        {/snippet}
      </PopupMenu>
    </RenderFor>
  </div>

  {#if !isFlanked}
    <PersonMastheadStats {stats} name={person.name} />
  {/if}

  {#if person.biography}
    <div class="masthead-deck">
      <SummaryOverview title={person.name} overview={person.biography} />
    </div>
  {/if}
  </div>
</article>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;
  @use "../header-kit/backdropDissolve" as dissolve;

  .trakt-people-masthead-header {
    /*
      One vertical rhythm for the whole stack, as the media masthead has - the gaps
      between portrait, name, facts and deck all resolve here so they cannot drift.
    */
    --masthead-rhythm: var(--gap-l);
    --portrait-width: clamp(var(--ni-132), 17vw, var(--ni-220));

    /*
      The same derivation the media masthead uses, and for the same reason: the
      band's height and the content's overlap both come from the portrait, so the
      portrait's base lands exactly where the band ends and the dissolve completes
      there. Resize the portrait and both follow.

      This is what was wrong before. The band was an absolutely positioned 480px
      slab with no overlap, so the portrait sat in normal flow BELOW the card's top
      padding while the band ran on past its base - which is why the whole
      composition read as sitting lower than the media masthead's.
    */
    --portrait-height: calc(var(--portrait-width) * 1.5);
    --backdrop-reveal: var(--masthead-rhythm);
    --backdrop-height: calc(var(--portrait-height) + var(--backdrop-reveal));
    --backdrop-overlap: calc(-1 * var(--portrait-height));

    /*
      Same size range the media masthead gives its title, so a person's name and a
      title's name are the same weight of statement. Names have nothing like the
      length spread of media titles, so every bucket takes the same range.
    */
    --title-size-large: clamp(var(--ni-32), 5.2vw, var(--ni-66));
    --title-size-medium: clamp(var(--ni-32), 5.2vw, var(--ni-66));
    --title-size-small: clamp(var(--ni-28), 4.4vw, var(--ni-56));
    --title-measure: 20ch;

    /* Shared with the header primitives - the meta row's dividers resolve here. */
    --summary-header-hairline: color-mix(
      in srgb,
      var(--color-foreground) 12%,
      transparent
    );

    position: relative;

    /*
      The same card surface the media masthead has: rounded, on the page background,
      with a stroke that fades out downward. Deliberately NOT `overflow: hidden` -
      the overflow menu opens downward out of this card, and clipping here crops it.
      The band clips itself to the top corners instead.
    */
    border-radius: var(--border-radius-xl);
    background: var(--color-background);

    box-sizing: border-box;
    /* Matches the measure the lists below use, so the edges line up. */
    max-width: var(--list-inner-width);
    /*
      Fluid side padding sets the centred measure. Fixed padding was what broke the
      media masthead between 1024px and its design width, so this starts fluid.
    */
    margin: var(--masthead-rhythm) var(--layout-distance-side);
    padding: 0 clamp(var(--gap-m), 8vw, var(--ni-120)) var(--ni-40);

    /*
      The gap already spaces the stack evenly, but a large name's line box carries
      dead space above its capitals that makes its neighbours look further away.
      Trimming to the cap edge makes the gap the space you actually see.
    */
    @supports (text-box-trim: trim-both) {
      :global(.trakt-summary-header-title),
      .masthead-deck {
        text-box-trim: trim-both;
        text-box-edge: cap alphabetic;
      }
    }

    @include for-tablet-sm-and-below {
      padding: var(--ni-28) var(--gap-m);
    }
  }

  /*
    One centred row for the facts, socials and actions. It wraps as a whole rather
    than letting the facts wrap inside themselves, which is what produced a
    stranded separator with nothing after it.
  */
  /*
    The person's own facts on one line, their links on the next, and the two pulled
    snug under the name. As a single row it held five different kinds of thing -
    measurements, a date, an age, brand marks and controls - and read as a toolbar
    rather than as a caption to the name.

    Negative margins rather than a smaller `gap`, because the stack's gap is the
    shared rhythm and these two rows are the exception to it: they belong to the
    name above them, not to the blocks around it.
  */
  .masthead-meta {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--gap-s);

    margin-top: calc(-1 * var(--gap-s));

    /*
      One size for the whole row, set here rather than left to each child.

      The facts line defaults to 14px, which is right in the masthead's credits
      column where a label sits above it, but on a shared row it reads smaller than
      everything beside it. Both the row and the facts resolve through this, so
      nothing in here can end up on its own scale.
    */
    font-size: var(--ni-16);
    --facts-inline-size: var(--ni-16);

    --action-button-size: var(--ni-32);

    /*
      Every icon in the row to one size. ActionButton sizes the button, not its
      contents, and these icons disagree about their own: ShareIcon declares 40px
      where the social marks declare 24, so it rendered half again as large in an
      identical button and overflowed its content box - which is also what pulled
      the row out of alignment.
    */
    :global(.trakt-action-button svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .masthead-links {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--gap-s);

    /* Snug to the facts line above rather than a full rhythm away. */
    margin-top: calc(-1 * var(--gap-s));

    --action-button-size: var(--ni-32);

    :global(.trakt-action-button svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .meta-divider {
    width: var(--ni-1);
    height: var(--ni-14);

    background: var(--summary-header-hairline, var(--color-border));
  }

  .trakt-people-masthead-header::before {
    @include dissolve.masthead-stroke;
  }

  .masthead-backdrop {
    /* Ends exactly at the portrait's base - see the geometry block above. */
    height: var(--backdrop-height);

    /* Clips the artwork to the card's top corners, as the media band does. */
    overflow: hidden;
    border-start-start-radius: var(--border-radius-xl);
    border-start-end-radius: var(--border-radius-xl);
    /* Full-bleed within the card, as the media masthead's band is. */
    margin-inline: calc(-1 * clamp(var(--gap-m), 8vw, var(--ni-120)));
  }

  .masthead-content {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--masthead-rhythm);
  }

  /*
    With a band above, the content is pulled back up over it so the portrait clears
    the card's top edge by the reveal alone. Without one there is nothing to overlap,
    so it simply takes the reveal as padding.
  */
  .trakt-people-masthead-header[data-has-backdrop="true"] .masthead-content {
    margin-top: var(--backdrop-overlap);
  }

  .trakt-people-masthead-header[data-has-backdrop="false"] .masthead-content {
    padding-top: var(--masthead-rhythm);
  }

  /*
    Portrait with the stats either side of it. The side cells are equal `1fr`, so the
    portrait stays dead centre whatever the flanks hold - including nothing, when a
    person has credits of only one kind.
  */
  .masthead-crown {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: var(--ni-32);

    width: 100%;
  }

  .masthead-crown[data-flanked="false"] {
    /* Nothing to flank with - collapse to the portrait alone. */
    grid-template-columns: auto;
    justify-content: center;
  }

  .crown-flank {
    display: flex;

    &[data-side="start"] {
      justify-content: flex-end;
    }

    &[data-side="end"] {
      justify-content: flex-start;
    }
  }

  /*
    Below desktop the portrait needs the full width, and the flanks would squeeze it
    rather than fill space that no longer exists. They move under it instead.
  */
  @include for-tablet-sm-and-below {
    .masthead-crown {
      /*
        Two columns, but the portrait spans both and the flanks share the row
        beneath it. Collapsing to a single column instead would auto-place one stat
        ABOVE the portrait, which is why the columns stay.
      */
      grid-template-columns: repeat(2, minmax(0, 1fr));
      justify-items: center;
      gap: var(--masthead-rhythm) var(--ni-32);
    }

    .masthead-portrait {
      grid-column: 1 / -1;
    }

    .crown-flank {
      grid-row: 2;

      &[data-side="start"] {
        justify-content: flex-end;
      }

      &[data-side="end"] {
        justify-content: flex-start;
      }
    }
  }

  .masthead-portrait {
    --summary-poster-width: var(--portrait-width);
    --summary-poster-radius: var(--border-radius-m);
  }

  .masthead-kicker {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--purple-300);
  }




  .masthead-deck {
    /*
      ClampedText lays its text and its more/less control out as a ROW, which off-centres
      the whole block by the width of the control - the text is no longer centred on
      the name above it. Stacked, the control sits under its own text and centred.
    */
    :global(.trakt-clamped-text) {
      flex-direction: column;
      align-items: center;
    }

    max-width: 62ch;

    font-size: var(--ni-16);
    line-height: 1.65;
    color: var(--color-text-secondary);
    text-wrap: pretty;
  }

</style>
