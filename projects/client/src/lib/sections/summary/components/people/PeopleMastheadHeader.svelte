<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import TrophyIcon from "$lib/components/icons/TrophyIcon.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import PersonAwardsDrawer from "./_internal/PersonAwardsDrawer.svelte";
  import { usePersonAwards } from "./_internal/usePersonAwards.ts";
  import Link from "$lib/components/link/Link.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { riseFade } from "$lib/utils/transitions/riseFade";
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
  import {
    PERSON_STATS_FRAME_PARAM,
    toPersonStatsFrame,
  } from "./_internal/PersonStatsFrame.ts";
  import PersonMastheadStats from "./_internal/PersonMastheadStats.svelte";
  /*
    Imported the same way this folder's sibling PeopleSummary already imports them.
    If this treatment graduates, these three belong one level up in `people/` -
    they are shared by three headers now, not private to v2.
  */
  import ExternalLinkAction from "../_internal/ExternalLinkAction.svelte";
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
    Where the stats sit - inline with the links row by default; `?stats=flank`
    and `?stats=below` keep the flanked and stacked alternatives reachable.
  */
  const statsLayout = $derived(
    toPersonStatsLayout(page.url.searchParams.get(PERSON_STATS_PARAM)),
  );
  const isStatsLoading = $derived($creditCounts?.isLoading ?? true);

  /*
    Wins lead, nominations understudy: the pill counts awards when there are
    any, and falls back to counting nominations - "3 Awards" beats "5
    Nominations" beats silence, and silence only when there is neither.
  */
  const { awards: personAwards } = $derived(
    usePersonAwards({ slug: person.slug }),
  );
  const awardWins = $derived(
    personAwards.filter((award) => award.isWinner).length,
  );
  const awardsPill = $derived.by(() => {
    if (awardWins > 0) return m.text_person_awards_count({ count: awardWins });
    if (personAwards.length > 0) {
      return m.text_person_nominations_count({ count: personAwards.length });
    }
    return null;
  });

  let isAwardsOpen = $state(false);

  /*
    Depends on the LAYOUT only, never on whether the data has arrived. It used to
    include `stats.length > 0`, which meant the crown restructured from one column
    to three the moment the counts landed - the portrait re-laid-out beneath them and
    their arrival read as a glitch. The columns are now reserved from the first paint
    and a placeholder holds them.
  */
  const isFlanked = $derived(statsLayout === "flank");
  const isInlineStats = $derived(statsLayout === "inline");

  /* How the stats are framed - `?statframe=glass|ghost`. See PersonStatsFrame. */
  const statsFrame = $derived(
    toPersonStatsFrame(page.url.searchParams.get(PERSON_STATS_FRAME_PARAM)),
  );

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
            frame={statsFrame}
            isLoading={isStatsLoading}
          />
        </div>
      {/if}

      <div class="masthead-portrait">
        <SummaryPoster src={person.headshot.url.medium} alt={person.name} />
      </div>

      {#if isFlanked}
        <div class="crown-flank" data-side="end">
          <PersonMastheadStats
            stats={stats.slice(1)}
            name={person.name}
            orientation="stacked"
            frame={statsFrame}
            isLoading={isStatsLoading}
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
    {#if isInlineStats && (isStatsLoading || stats.length > 0)}
      {#if isStatsLoading}
        <!-- Holds the counts' place so the row doesn't reflow when they land. -->
        <Skeleton width="var(--ni-120)" height="var(--ni-14)" />
      {:else}
        <span class="links-stats" in:riseFade>
          {#each stats as stat (stat.key)}
            <Link
              href={stat.href}
              target="_self"
              color="inherit"
              label={m.link_label_view_person_credits({
                credits: stat.label,
                name: person.name,
              })}
            >
              <span class="links-stat">
                <span class="stat-value bold">{stat.value}</span>
                {stat.label}
              </span>
            </Link>
          {/each}

          <RenderForFeature
            flag={FeatureFlag.SummaryAwards}
            audience="director"
          >
            {#snippet enabled()}
              {#if awardsPill}
                <button
                  type="button"
                  class="links-stat award-pill"
                  aria-label={m.button_label_view_awards({
                    title: person.name,
                  })}
                  onclick={() => (isAwardsOpen = true)}
                >
                  <span class="award-pill-mark"><TrophyIcon /></span>
                  {awardsPill}
                </button>
              {/if}
            {/snippet}
          </RenderForFeature>
        </span>
      {/if}
      <span class="meta-divider work-divider" aria-hidden="true"></span>
    {/if}

    <!--
      One atomic cluster. As loose children of the wrapping row these broke apart
      mid-cluster on resize - a divider stranded at a row's end, the share split
      from its menu. Wrapping now only ever happens between the counts and this.
    -->
    <div class="links-cluster">
      {#if hasSocialMediaLinks(person) || person.imdb}
        {#if hasSocialMediaLinks(person)}
          <SocialMediaLinks {person} />
        {/if}
        {#if person.imdb}
          <ExternalLinkAction
            id={person.imdb}
            type="imdb-person"
            source="person-summary"
          />
        {/if}
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
  </div>

  {#if statsLayout === "below"}
    <PersonMastheadStats
      {stats}
      name={person.name}
      frame={statsFrame}
      isLoading={isStatsLoading}
    />
  {/if}

  {#if isAwardsOpen}
    <PersonAwardsDrawer
      awards={personAwards}
      onClose={() => (isAwardsOpen = false)}
    />
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
    /*
      The gap inside the name's cluster - name, facts, links - and from that cluster
      down to the biography. Tighter than the stack's rhythm because these belong to
      the name rather than being blocks in their own right.

      All three boundaries take the same value, which is what makes the facts-to-links
      and links-to-biography gaps read as equal. They already balance optically: the
      social buttons carry ~6px of padding inside their box, and exactly one button
      edge borders each of those two gaps, so equal CSS gaps land as equal ink.
    */
    --meta-gap: var(--gap-s);
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

    /*
      A breath more than the shared meta distance: the name is set large enough
      that its descenders reach almost to this row's caps without it.
    */
    margin-top: calc(var(--meta-gap) + var(--gap-xxs) - var(--masthead-rhythm));

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
    margin-top: calc(var(--meta-gap) - var(--masthead-rhythm));

    --action-button-size: var(--ni-32);

    :global(.trakt-action-button svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  /*
    The counts as glass pills - the flanked stats' glass frame recycled at chip
    scale. Discreet is still the brief, but discreet meant quiet, not undressed:
    the first pass was Link's underlined grey prose, which read as lazy rather
    than as restrained.

    The surface is permanent where the big stats only wore it on hover; hover
    lifts it one step and brings the label to primary. Same recipe, same
    numbers - 6% resting, 10% raised - so the two layouts stay one family.
  */
  .links-stats {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    font-size: var(--font-size-text);

    :global(a) {
      text-decoration: none;
      border-radius: var(--border-radius-l);
    }

    .links-stat {
      display: inline-flex;
      align-items: center;
      gap: var(--gap-xxs);

      padding: var(--ni-6) var(--ni-14);
      border-radius: var(--border-radius-l);

      background-color: color-mix(
        in srgb,
        var(--color-foreground) 6%,
        transparent
      );
      border: var(--ni-1) solid var(--color-hairline);

      color: var(--color-text-secondary);

      transition: var(--transition-increment) ease-in-out;
      transition-property: background-color, color;
    }

    .stat-value {
      color: var(--color-text-primary);
    }

    @include for-mouse {
      :global(a:hover .links-stat) {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 10%,
          transparent
        );
        color: var(--color-text-primary);
      }
    }

    :global(a:focus-visible .links-stat) {
      background-color: color-mix(
        in srgb,
        var(--color-foreground) 10%,
        transparent
      );
      color: var(--color-text-primary);
    }

    /*
      The award pill is the same glass as its neighbours, poured in gold - a
      win deserves to glint. It shares .links-stat for the geometry; `font:
      inherit` matters because it is a button, and the UA font made it run
      smaller than the anchor pills beside it.
    */
    .award-pill {
      font: inherit;
      cursor: pointer;

      color: var(--yellow-300);
      background-color: color-mix(in srgb, var(--yellow-500) 14%, transparent);
      border-color: color-mix(in srgb, var(--yellow-400) 28%, transparent);

      @include for-mouse {
        &:hover {
          color: var(--yellow-200);
          background-color: color-mix(
            in srgb,
            var(--yellow-500) 22%,
            transparent
          );
        }
      }

      &:focus-visible {
        color: var(--yellow-200);
        background-color: color-mix(
          in srgb,
          var(--yellow-500) 22%,
          transparent
        );
      }
    }

    .award-pill-mark {
      display: inline-flex;
      align-items: center;

      /* Spans the text line, no taller - the icon was stretching the pill
         past its movie/show neighbours. */
      height: calc(var(--font-size-text) * 1.2);

      :global(svg) {
        width: var(--ni-12);
        height: var(--ni-12);
      }
    }
  }

  .meta-divider {
    width: var(--ni-1);
    height: var(--ni-14);

    background: var(--color-hairline);
  }

  .links-cluster {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-s);
  }

  /*
    Stacked deliberately below tablet-sm: the counts take a row, the socials take
    the next. Left to flex-wrap, the row broke wherever it happened to run out of
    width. The divider between them marks a boundary that stacking already draws,
    so it goes.
  */
  @include for-tablet-sm-and-below {
    .masthead-links {
      flex-direction: column;
      gap: var(--gap-m);
    }

    .work-divider {
      display: none;
    }
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
  }

  .masthead-content {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--masthead-rhythm);

    /*
      The fluid measure lives HERE, not on the card - the media masthead's
      arrangement. With the padding on the card, the band needed a negative margin
      to bleed back out, and the two drifted apart the moment a breakpoint
      overrode one without the other: the stroke floated above the band and the
      band poked past the card's sides on mobile.
    */
    padding: 0 clamp(var(--gap-m), 8vw, var(--ni-120)) var(--ni-40);

    @include for-tablet-sm-and-below {
      padding: 0 var(--gap-m) var(--ni-28);
    }
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

    /*
      The kicker and the name belong to the portrait, not to the column's beat. At
      the full rhythm each sat a band apart and the identity read as three items in
      a list; pulled in, portrait-kicker-name reads as one unit.
    */
    margin-top: calc(var(--gap-m) - var(--masthead-rhythm));

    /*
      The name follows its kicker at a breath - a slightly fuller one than
      before: tall ascenders (a capital name right under the tag) crowded the
      kicker at 4px.
    */
    + :global(.trakt-summary-header-title) {
      margin-top: calc(var(--gap-xs) - var(--masthead-rhythm));
    }
  }




  .masthead-deck {
    /* Same distance below the links as the links sit below the facts. */
    margin-top: calc(var(--meta-gap) - var(--masthead-rhythm));

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
