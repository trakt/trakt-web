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

  const facts = $derived(mapToPersonFacts({ person, now: new Date() }));

  /*
    Which backdrop treatment to show, from the URL - `?backdrop=credit|headshot|
    colors`, defaulting to none. A search param rather than a flag because these
    are three candidates being compared rather than a feature being shipped: it
    switches without a rebuild and the comparison is shareable as a link.
  */
  const backdropVariant = $derived(
    toPersonBackdropVariant(page.url.searchParams.get(PERSON_BACKDROP_PARAM)),
  );

  const slug$ = fromRune(() => person.slug);
  const backdropMedia = usePersonBackdropMedia(slug$);
</script>

{#snippet tags()}
  {#if person.imdb}
    <ImdbLink imdbId={person.imdb} />
  {/if}
{/snippet}

<article class="trakt-people-masthead-header">
  <PersonMastheadBackdrop
    variant={backdropVariant}
    {person}
    media={$backdropMedia}
  />

  <div class="masthead-portrait">
    <SummaryPoster
      src={person.headshot.url.medium}
      alt={person.name}
      {tags}
    />
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

    {#if hasSocialMediaLinks(person)}
      <span class="meta-divider" aria-hidden="true"></span>
      <SocialMediaLinks {person} />
    {/if}

    <span class="meta-divider" aria-hidden="true"></span>

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

  {#if person.biography}
    <div class="masthead-deck">
      <SummaryOverview title={person.name} overview={person.biography} />
    </div>
  {/if}
</article>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-people-masthead-header {
    /*
      One vertical rhythm for the whole stack, as the media masthead has - the gaps
      between portrait, name, facts and deck all resolve here so they cannot drift.
    */
    --masthead-rhythm: var(--gap-l);
    --portrait-width: clamp(var(--ni-132), 17vw, var(--ni-220));

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

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--masthead-rhythm);

    /*
      Anchors the backdrop, and isolates it so its negative z-index stays behind
      this header's content rather than falling behind the page itself.
    */
    position: relative;
    isolation: isolate;

    box-sizing: border-box;
    /* Matches the measure the lists below use, so the edges line up. */
    max-width: var(--list-inner-width);
    /*
      Fluid side padding sets the centred measure. Fixed padding was what broke the
      media masthead between 1024px and its design width, so this starts fluid.
    */
    margin: var(--masthead-rhythm) var(--layout-distance-side);
    /*
      Top inset is the rhythm, not 40px, so the portrait sits exactly as high as
      the media masthead's poster does - that one clears the card's top edge by the
      backdrop's reveal, which is also the rhythm. At 40px this sat 16px lower with
      nothing in the gap to justify it.
    */
    padding: var(--masthead-rhythm) clamp(var(--gap-m), 8vw, var(--ni-120))
      var(--ni-40);

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
  .masthead-meta {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--gap-s);

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

  .meta-divider {
    width: var(--ni-1);
    height: var(--ni-14);

    background: var(--summary-header-hairline, var(--color-border));
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
    max-width: 62ch;

    font-size: var(--ni-16);
    line-height: 1.65;
    color: var(--color-text-secondary);
    text-wrap: pretty;
  }

</style>
