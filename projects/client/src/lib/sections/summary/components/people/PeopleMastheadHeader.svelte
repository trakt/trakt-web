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
  /*
    Imported the same way this folder's sibling PeopleSummary already imports them.
    If this treatment graduates, these three belong one level up in `people/` -
    they are shared by three headers now, not private to v2.
  */
  import ImdbLink from "./v2/_internal/ImdbLink.svelte";
  import PersonDetails from "./v2/_internal/PersonDetails.svelte";
  import SocialMediaLinks from "./v2/_internal/SocialMediaLinks.svelte";
  import { hasSocialMediaLinks } from "./v2/_internal/hasSocialMediaLinks";

  /*
    The people page given the masthead treatment: headshot centre stage, name as
    the masthead, biography as the deck, and the facts about the person - birth,
    age, height - centred beneath it with their socials.

    Two deliberate departures from the media masthead:

    - No backdrop band. A person has a headshot and nothing else; there is no
      16:9 artwork to dissolve, and stretching a portrait into a band looked
      exactly as bad as it sounds. The composition carries itself on the centred
      stack instead.
    - The facts sit in ONE centred row rather than a left-aligned strip. On a
      title the strip earns its left alignment by holding four or five columns of
      different kinds of data; a person has three short facts, and centring them
      keeps them part of the masthead rather than a data table under it.
  */
  const { person }: { person: PersonSummary } = $props();
</script>

{#snippet tags()}
  {#if person.imdb}
    <ImdbLink imdbId={person.imdb} />
  {/if}
{/snippet}

<article class="trakt-people-masthead-header">
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

  <h1 class="masthead-name">{person.name}</h1>

  <div class="masthead-facts">
    <PersonDetails
      birthday={person.birthday}
      deathDate={person.deathDate}
      height={person.height}
    />
  </div>

  {#if hasSocialMediaLinks(person)}
    <div class="masthead-socials">
      <SocialMediaLinks {person} />
    </div>
  {/if}

  {#if person.biography}
    <div class="masthead-deck">
      <SummaryOverview title={person.name} overview={person.biography} />
    </div>
  {/if}

  <div class="masthead-actions">
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

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--masthead-rhythm);

    box-sizing: border-box;
    /* Matches the measure the lists below use, so the edges line up. */
    max-width: var(--list-inner-width);
    /*
      Fluid side padding sets the centred measure. Fixed padding was what broke the
      media masthead between 1024px and its design width, so this starts fluid.
    */
    margin: var(--masthead-rhythm) var(--layout-distance-side);
    padding: var(--ni-40) clamp(var(--gap-m), 8vw, var(--ni-120));

    /*
      The gap already spaces the stack evenly, but a large name's line box carries
      dead space above its capitals that makes its neighbours look further away.
      Trimming to the cap edge makes the gap the space you actually see.
    */
    @supports (text-box-trim: trim-both) {
      .masthead-name,
      .masthead-deck {
        text-box-trim: trim-both;
        text-box-edge: cap alphabetic;
      }
    }

    @include for-tablet-sm-and-below {
      padding: var(--ni-28) var(--gap-m);
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

  .masthead-name {
    /*
      Fluid rather than fixed. Names have nothing like the length spread of media
      titles, so this needs no length buckets - only a range.
    */
    font-size: clamp(var(--ni-32), 5.2vw, var(--ni-66));
    font-weight: 700;
    line-height: 1.03;
    letter-spacing: -0.03em;
    color: var(--color-text-primary);

    text-wrap: balance;
    max-width: 20ch;
    margin: 0;
  }

  .masthead-facts {
    display: flex;
    justify-content: center;

    /*
      PersonDetails lays its facts out as a row with separators, which is already
      what this needs - it only has to be centred rather than left-aligned.
    */
    :global(.trakt-person-details) {
      justify-content: center;
      flex-wrap: wrap;
    }
  }

  .masthead-socials {
    display: flex;
    justify-content: center;
  }

  .masthead-deck {
    max-width: 62ch;

    font-size: var(--ni-16);
    line-height: 1.65;
    color: var(--color-text-secondary);
    text-wrap: pretty;
  }

  .masthead-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-s);

    --action-button-size: var(--ni-48);
  }
</style>
