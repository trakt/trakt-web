<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages";
  import MediaReactions from "$lib/features/media-reactions/MediaReactions.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { useSocialActivities } from "../../_internal/useSocialActivities";
  import { useMediaAwards } from "../../awards/useMediaAwards";
  import SummaryHeaderFacts from "../../header-kit/SummaryHeaderFacts.svelte";
  import { useTrivia } from "../../trivia/useTrivia";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import SummaryHeaderAwards from "./_internal/SummaryHeaderAwards.svelte";
  import SummaryHeaderByline from "./_internal/SummaryHeaderByline.svelte";
  import SummaryHeaderSectionHeader from "./_internal/SummaryHeaderSectionHeader.svelte";
  import SummaryHeaderSentiment from "./_internal/SummaryHeaderSentiment.svelte";
  import SummaryHeaderSocialActivity from "./_internal/SummaryHeaderSocialActivity.svelte";
  import SummaryHeaderTrivia from "./_internal/SummaryHeaderTrivia.svelte";
  import SummaryHeaderWatchOptions from "./_internal/SummaryHeaderWatchOptions.svelte";
  import { mapToSummaryHeaderFacts } from "./_internal/mapToSummaryHeaderFacts.ts";
  import { toHeaderProviders } from "./_internal/toHeaderProviders.ts";
  import { toSummarySentiment } from "./_internal/toSummarySentiment.ts";
  import type { MediaSummaryEntry } from "../models/MediaSummaryEntry.ts";

  /*
    Every header section, stacked - what the masthead strip used to spread across
    the top of the page now lives here, one section per band, at the same density
    each column had. Each band's header drills into the section's own full drawer
    where one exists; awards has no deeper view yet, so it shows everything it has.

    The strip's compact tokens reference this drawer; this drawer references the
    deep views. Three levels, each one tap apart.
  */
  const {
    entry,
    crew,
    sentiment,
    streamOn,
    onClose,
  }: {
    entry: MediaSummaryEntry;
    crew: MediaCrew;
    sentiment?: SentimentAnalysis | null;
    streamOn?: StreamOn;
    onClose: () => void;
  } = $props();

  const media = $derived(entry.media);
  const type = $derived(entry.type);

  const facts = $derived(mapToSummaryHeaderFacts(entry));
  const RELEASE_FACT_KEYS = ["year", "length", "certification"];
  const releaseFacts = $derived(
    facts.filter((fact) => RELEASE_FACT_KEYS.includes(fact.key)),
  );
  const classificationFacts = $derived(
    facts.filter((fact) => !RELEASE_FACT_KEYS.includes(fact.key)),
  );

  const providers = $derived(toHeaderProviders(streamOn, 2));
  const { country } = useStreamingPreferences();

  const headerSentiment = $derived(toSummarySentiment(sentiment));

  const socialTarget$ = fromRune(() => ({ type, slug: media.slug }));
  const { entries: socialEntries } = useSocialActivities(socialTarget$);
  const SOCIAL_LIMIT = 3;
  const drawerSocialEntries = $derived($socialEntries.slice(0, SOCIAL_LIMIT));

  const TRIVIA_LIMIT = 2;
  const { summary: triviaSummary } = $derived(
    useTrivia({ slug: media.slug, type, variant: "no-spoilers" }),
  );
  const triviaFacts = $derived($triviaSummary.slice(0, TRIVIA_LIMIT));

  const { awards } = $derived(useMediaAwards({ slug: media.slug }));

  const { buildDrawerLink } = summaryDrawerNavigation();
  const detailsLink = $derived(buildDrawerLink(SummaryDrawers.Details));
  const whereToWatchLink = $derived(
    buildDrawerLink(SummaryDrawers.WhereToWatch),
  );
  const socialLink = $derived(buildDrawerLink(SummaryDrawers.Social));
  const sentimentLink = $derived(buildDrawerLink(SummaryDrawers.Sentiment));
  const triviaLink = $derived(buildDrawerLink(SummaryDrawers.Trivia));
</script>

<Drawer
  title={m.drawer_title_at_a_glance({ title: media.title })}
  {onClose}
>
  <div class="trakt-glance-drawer">
    <section class="glance-section">
      <SummaryHeaderSectionHeader
        title={m.header_credits_and_details()}
        drilldown={{
          ...detailsLink,
          label: m.button_label_details({ title: media.title }),
        }}
      />
      <div class="glance-section-body">
        <SummaryHeaderByline {type} {crew} layout="stacked" />
        <SummaryHeaderFacts facts={releaseFacts} variant="inline" />
        <SummaryHeaderFacts facts={classificationFacts} variant="inline" />
      </div>
    </section>

    {#if providers.length > 0}
      <section class="glance-section">
        <SummaryHeaderSectionHeader
          title={m.list_title_where_to_watch()}
          drilldown={{
            ...whereToWatchLink,
            label: m.button_label_view_all_where_to_watch(),
          }}
        />
        <SummaryHeaderWatchOptions {providers} country={$country} />
      </section>
    {/if}

    <RenderFor audience="authenticated">
      {#if drawerSocialEntries.length > 0}
        <section class="glance-section">
          <SummaryHeaderSectionHeader
            title={m.list_title_social_activity()}
            drilldown={{
              ...socialLink,
              label: m.button_label_view_all_social_activity(),
            }}
          />
          <SummaryHeaderSocialActivity entries={drawerSocialEntries} />
        </section>
      {/if}
    </RenderFor>

    {#if headerSentiment}
      <section class="glance-section">
        <SummaryHeaderSectionHeader
          title={m.header_community_sentiment()}
          drilldown={{
            ...sentimentLink,
            label: m.button_label_view_sentiment_analysis(),
          }}
        />
        <SummaryHeaderSentiment sentiment={headerSentiment} />
      </section>
    {/if}

    <RenderForFeature flag={FeatureFlag.SummaryAwards} audience="director">
      {#snippet enabled()}
        {#if awards.length > 0}
          <section class="glance-section">
            <SummaryHeaderSectionHeader title={m.header_awards()} />
            <SummaryHeaderAwards {awards} />
          </section>
        {/if}
      {/snippet}
    </RenderForFeature>

    <RenderForFeature flag={FeatureFlag.Reactions} audience="director">
      {#snippet enabled()}
        <section class="glance-section">
          <SummaryHeaderSectionHeader title={m.header_reactions()} />
          <MediaReactions {type} slug={media.slug} title={media.title} />
        </section>
      {/snippet}
    </RenderForFeature>

    {#if triviaFacts.length > 0}
      <section class="glance-section">
        <SummaryHeaderSectionHeader
          title={m.list_title_trivia()}
          drilldown={{
            ...triviaLink,
            label: m.button_label_view_trivia(),
          }}
        />
        <SummaryHeaderTrivia facts={triviaFacts} />
      </section>
    {/if}

    <p class="glance-hint">{m.text_glance_drill_hint()}</p>
  </div>
</Drawer>

<style lang="scss">
  .trakt-glance-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);
  }

  .glance-section {
    display: flex;
    flex-direction: column;
    gap: var(--ni-14);

    /* The header's thin rule between bands, not boxes around them. */
    &:not(:first-child) {
      padding-top: var(--ni-24);
      border-top: var(--ni-1) solid var(--color-hairline);
    }
  }

  .glance-section-body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .glance-hint {
    margin: 0;
    padding-top: var(--gap-s);

    font-size: var(--font-size-tag);
    color: var(--color-text-secondary);
    text-align: center;
  }
</style>
