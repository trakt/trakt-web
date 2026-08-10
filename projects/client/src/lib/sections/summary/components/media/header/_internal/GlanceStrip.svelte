<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import * as m from "$lib/features/i18n/messages";
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import TrophyIcon from "$lib/components/icons/TrophyIcon.svelte";
  import StreamingServiceLogo from "$lib/components/media/streaming-service/StreamingServiceLogo.svelte";
  import { StreamingServiceLogoIntlProvider } from "$lib/components/media/streaming-service/StreamingServiceLogoIntlProvider";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { reactionSentimentDefinitions } from "$lib/features/media-reactions/reactionSentimentDefinitions.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import type { GlanceStripProps } from "./GlanceStripProps.ts";

  /*
    The whole header's intelligence, folded to one line.

    Every section that has something to say gets a compact token - release facts,
    the lead provider, who among your follows touched this, the sentiment verdict,
    and counts for awards, reactions and trivia. Each token roots straight to its
    section's own drawer: details, listings, social, sentiment, reactions, trivia.
    Awards opens the at-a-glance drawer, the one place the full list lives.

    Sections with nothing to say render nothing - the separator is each segment's
    own leading bar (`a + a`), so absent segments never strand one.
  */
  const {
    links,
    title,
    labeled = false,
    release,
    provider,
    country,
    social,
    sentiment,
    awardsCount,
    reactions,
    triviaCount,
  }: GlanceStripProps = $props();

  const topReactionGlyphs = $derived(
    (reactions?.top ?? []).map(
      (sentimentKey) => reactionSentimentDefinitions[sentimentKey],
    ),
  );
</script>

<div class="trakt-glance-strip">
  <span class="strip-surface">
    {#if release}
      <Tooltip content={m.button_label_details({ title })} variant="compact">
        <Link href={links.details} color="inherit" label={m.button_label_details({ title })}>
          <span class="glance-segment" data-labeled={labeled}>
            <span class="segment-value glance-release">{release}</span>
            {#if labeled}
              <span class="segment-label">{m.header_details()}</span>
            {/if}
          </span>
        </Link>
      </Tooltip>
    {/if}

    {#if provider}
      <Tooltip content={m.button_label_view_all_where_to_watch()} variant="compact">
        <Link
          href={links.whereToWatch}
          color="inherit"
          label={m.button_label_view_all_where_to_watch()}
        >
          <span class="glance-segment" data-labeled={labeled}>
            <span class="segment-value">
              <span class="glance-provider-logo">
                <StreamingServiceLogo
                  source={provider.source}
                  {country}
                  i18n={StreamingServiceLogoIntlProvider}
                />
              </span>
            </span>
            {#if labeled}
              <span class="segment-label">{m.list_title_where_to_watch()}</span>
            {/if}
          </span>
        </Link>
      </Tooltip>
    {/if}

    {#if social && social.count > 0}
      <RenderFor audience="authenticated">
        <Tooltip content={m.button_label_view_all_social_activity()} variant="compact">
          <Link
            href={links.social}
            color="inherit"
            label={m.button_label_view_all_social_activity()}
          >
            <span class="glance-segment" data-labeled={labeled}>
              <span class="segment-value">
                <span class="glance-avatars">
                  {#each social.users as user (user.slug)}
                    <span class="glance-avatar">
                      <UserAvatar {user} size="small" />
                    </span>
                  {/each}
                </span>
                {social.count}
              </span>
              {#if labeled}
                <span class="segment-label">{m.list_title_social_activity()}</span>
              {/if}
            </span>
          </Link>
        </Tooltip>
      </RenderFor>
    {/if}

    {#if sentiment}
      <Tooltip content={m.button_label_view_sentiment_analysis()} variant="compact">
        <Link
          href={links.sentiment}
          color="inherit"
          label={m.button_label_view_sentiment_analysis()}
        >
          <span class="glance-segment" data-labeled={labeled}>
            <span class="segment-value">
              <span class="glance-sentiment" data-verdict={sentiment.verdict}>
                {sentiment.label}
              </span>
            </span>
            {#if labeled}
              <span class="segment-label">{m.header_community_sentiment()}</span>
            {/if}
          </span>
        </Link>
      </Tooltip>
    {/if}

    {#if awardsCount > 0}
      <RenderForFeature flag={FeatureFlag.SummaryAwards} audience="director">
        {#snippet enabled()}
          <Tooltip content={m.button_label_view_awards({ title })} variant="compact">
            <Link
              href={links.awards}
              color="inherit"
              label={m.button_label_view_awards({ title })}
            >
              <span class="glance-segment" data-labeled={labeled}>
                <span class="segment-value">
                  <span class="glance-icon"><TrophyIcon /></span>
                  {awardsCount}
                </span>
                {#if labeled}
                  <span class="segment-label">{m.header_awards()}</span>
                {/if}
              </span>
            </Link>
          </Tooltip>
        {/snippet}
      </RenderForFeature>
    {/if}

    {#if reactions && reactions.total > 0}
      <RenderForFeature flag={FeatureFlag.Reactions} audience="director">
        {#snippet enabled()}
          <Tooltip content={m.button_label_view_reactions({ title })} variant="compact">
            <Link
              href={links.reactions}
              color="inherit"
              label={m.button_label_view_reactions({ title })}
            >
              <span class="glance-segment" data-labeled={labeled}>
                <span class="segment-value">
                  <span class="glance-glyphs">
                    {#each topReactionGlyphs as definition, index (definition.glyph)}
                      <span
                        class="glance-glyph"
                        style:z-index={topReactionGlyphs.length - index}
                        role="img"
                        aria-label={definition.label()}
                      >
                        {definition.glyph}
                      </span>
                    {/each}
                  </span>
                  {reactions.total}
                </span>
                {#if labeled}
                  <span class="segment-label">{m.header_reactions()}</span>
                {/if}
              </span>
            </Link>
          </Tooltip>
        {/snippet}
      </RenderForFeature>
    {/if}

    {#if triviaCount > 0}
      <Tooltip content={m.button_label_view_trivia()} variant="compact">
        <Link href={links.trivia} color="inherit" label={m.button_label_view_trivia()}>
          <span class="glance-segment" data-labeled={labeled}>
            <span class="segment-value">
              <span class="glance-icon glance-icon-trivia"><SparkleIcon /></span>
              {m.text_glance_fact_count({ count: triviaCount })}
            </span>
            {#if labeled}
              <span class="segment-label">{m.list_title_trivia()}</span>
            {/if}
          </span>
        </Link>
      </Tooltip>
    {/if}
  </span>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-glance-strip {
    display: block;
  }

  .strip-surface {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--gap-xs) var(--gap-s);

    padding: var(--ni-12) var(--ni-24);
    border-radius: var(--border-radius-xl);

    /* The header's glass recipe - permanent, since the surface itself is inert. */
    background-color: color-mix(
      in srgb,
      var(--color-foreground) 6%,
      transparent
    );
    border: var(--ni-1) solid var(--color-hairline);

    font-size: var(--font-size-text);
    color: var(--color-text-secondary);

    /* Labeled tokens are taller - the boundary bars keep up. */
    &:has(.glance-segment[data-labeled="true"]) {
      --glance-divider-height: var(--ni-30);
    }

    /*
      Kills Link's prose underline - nothing in here is running text, and the
      anchor's decoration painted under every segment, separators included.
    */
    :global(.trakt-tooltip-trigger) {
      display: inline-flex;
    }

    :global(a) {
      text-decoration: none;
      display: inline-flex;
      color: inherit;
      transition: color var(--transition-increment) ease-in-out;
    }

    /*
      The hover lives on the ANCHOR, not the segment: Link pins every inner
      span to `color: inherit` at higher specificity than a scoped class, so
      the only reliable way to recolour a token is to recolour its anchor and
      let that rule do the delivering. Each token lifts alone - they are
      separate destinations.
    */
    :global(a:hover),
    :global(a:focus-visible) {
      color: var(--color-text-primary);
    }

    /*
      The separator is the header's thin vertical bar, owned by the boundary
      between neighbouring links - a segment that does not render never strands
      one at an edge. It keeps the surface's colour, not the hovered anchor's.
    */
    :global(.trakt-tooltip-trigger + .trakt-tooltip-trigger::before) {
      content: "";
      align-self: center;
      width: var(--ni-1);
      height: var(--glance-divider-height, var(--ni-14));
      background: var(--color-hairline);

      margin-inline-end: var(--gap-s);
    }
  }

  .glance-segment {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xxs);

    transition: color var(--transition-increment) ease-in-out;

    /* The labeled comparison: value over name, and a taller bar to match. */
    &[data-labeled="true"] {
      flex-direction: column;
      gap: var(--ni-4);
    }
  }

  .segment-value {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xxs);
  }

  .segment-label {
    font-size: var(--ni-10);
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .glance-release {
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: var(--font-size-tag);
    font-weight: 600;
  }

  .glance-provider-logo {
    display: inline-flex;
    align-items: center;

    :global(svg),
    :global(img) {
      height: var(--ni-24);
      width: auto;
    }
  }

  .glance-avatars {
    display: inline-flex;
    align-items: center;
  }

  .glance-avatar {
    display: inline-flex;

    /* Overlapped like a hand of cards - the count beside them says how many. */
    &:not(:first-child) {
      margin-inline-start: calc(-1 * var(--ni-6));
    }

    :global(.trakt-user-avatar) {
      width: var(--ni-20);
      height: var(--ni-20);
      border: var(--ni-1) solid var(--color-background);
    }
  }

  /*
    The sentiment section's own verdict pill, unchanged - one system. Nested
    under the segment so the colour outranks Link's inner-span inherit rule.
  */
  .glance-segment .glance-sentiment {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;

    padding: var(--ni-4) var(--ni-10);
    border-radius: 999px;

    color: var(--sentiment-color);
    background: color-mix(in srgb, var(--sentiment-color) 16%, transparent);

    &[data-verdict="positive"] {
      --sentiment-color: var(--green-400);
    }

    &[data-verdict="mixed"] {
      --sentiment-color: var(--yellow-400);
    }

    &[data-verdict="negative"] {
      --sentiment-color: var(--red-400);
    }
  }

  .glance-icon {
    display: inline-flex;
    align-items: center;

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }

  /* Trivia's mark is the purple sparkle. Nested to outrank the inherit rule. */
  .glance-segment .glance-icon-trivia {
    color: var(--purple-300);
  }

  .glance-glyphs {
    display: inline-flex;
    align-items: center;
  }

  .glance-glyph {
    font-size: var(--ni-14);
    line-height: 1;

    &:not(:first-child) {
      margin-inline-start: calc(-1 * var(--ni-4));
    }
  }
</style>
