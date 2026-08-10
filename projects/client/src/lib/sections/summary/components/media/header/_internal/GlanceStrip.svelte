<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import SparkleStarIcon from "$lib/components/icons/SparkleStarIcon.svelte";
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
      <Link href={links.details} label={m.button_label_details({ title })}>
        <span class="glance-segment glance-release">{release}</span>
      </Link>
    {/if}

    {#if provider}
      <Link
        href={links.whereToWatch}
        label={m.button_label_view_all_where_to_watch()}
      >
        <span class="glance-segment">
          <span class="glance-provider-logo">
            <StreamingServiceLogo
              source={provider.source}
              {country}
              i18n={StreamingServiceLogoIntlProvider}
            />
          </span>
        </span>
      </Link>
    {/if}

    {#if social && social.count > 0}
      <RenderFor audience="authenticated">
        <Link
          href={links.social}
          label={m.button_label_view_all_social_activity()}
        >
          <span class="glance-segment">
            <span class="glance-avatars">
              {#each social.users as user (user.slug)}
                <span class="glance-avatar">
                  <UserAvatar {user} size="small" />
                </span>
              {/each}
            </span>
            {social.count}
          </span>
        </Link>
      </RenderFor>
    {/if}

    {#if sentiment}
      <Link
        href={links.sentiment}
        label={m.button_label_view_sentiment_analysis()}
      >
        <span class="glance-segment">
          <span class="glance-sentiment" data-verdict={sentiment.verdict}>
            {sentiment.label}
          </span>
        </span>
      </Link>
    {/if}

    {#if awardsCount > 0}
      <RenderForFeature flag={FeatureFlag.SummaryAwards} audience="director">
        {#snippet enabled()}
          <Link
            href={links.awards}
            label={m.button_label_view_awards({ title })}
          >
            <span class="glance-segment">
              <span class="glance-icon"><SparkleStarIcon /></span>
              {awardsCount}
            </span>
          </Link>
        {/snippet}
      </RenderForFeature>
    {/if}

    {#if reactions && reactions.total > 0}
      <RenderForFeature flag={FeatureFlag.Reactions} audience="director">
        {#snippet enabled()}
          <Link
            href={links.reactions}
            label={m.button_label_view_reactions({ title })}
          >
            <span class="glance-segment">
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
          </Link>
        {/snippet}
      </RenderForFeature>
    {/if}

    {#if triviaCount > 0}
      <Link href={links.trivia} label={m.button_label_view_trivia()}>
        <span class="glance-segment">
          <span class="glance-icon glance-icon-trivia"><SparkleIcon /></span>
          {triviaCount}
        </span>
      </Link>
    {/if}
  </span>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-glance-strip {
    display: block;

    /*
      Kills Link's prose underline for the whole strip - nothing in here is
      running text, and the anchor's decoration painted under every segment,
      separator bars included.
    */
    :global(a) {
      text-decoration: none;
      display: inline-flex;
    }

    /*
      The separator is the header's thin vertical bar, owned by the boundary
      between neighbouring links - a segment that does not render never strands
      one at an edge.
    */
    :global(a + a .glance-segment::before) {
      content: "";
      align-self: center;
      width: var(--ni-1);
      height: var(--ni-14);
      background: var(--color-hairline);

      margin-inline-end: var(--gap-s);
    }

    /* Each token lifts alone - they are separate destinations. */
    :global(a:hover .glance-segment),
    :global(a:focus-visible .glance-segment) {
      color: var(--color-text-primary);
    }
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
  }

  .glance-segment {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xxs);

    transition: color var(--transition-increment) ease-in-out;
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
      height: var(--ni-16);
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

  /* The sentiment section's own verdict pill, unchanged - one system. */
  .glance-sentiment {
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

  /* Trivia's mark is the purple sparkle - the count says the rest. */
  .glance-icon-trivia {
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
