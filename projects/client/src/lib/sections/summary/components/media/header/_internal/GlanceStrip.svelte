<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import SparkleStarIcon from "$lib/components/icons/SparkleStarIcon.svelte";
  import StreamingServiceLogo from "$lib/components/media/streaming-service/StreamingServiceLogo.svelte";
  import { StreamingServiceLogoIntlProvider } from "$lib/components/media/streaming-service/StreamingServiceLogoIntlProvider";
  import { useStreamingServiceLogo } from "$lib/components/media/streaming-service/useStreamingServiceLogo";
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
    and counts for awards, reactions and trivia. The strip is ONE control: it opens
    the at-a-glance drawer, where the sections appear in full and drill further.
    Nothing here is individually clickable, which is what lets it stay this small.

    Sections with nothing to say render nothing - the separator logic is CSS
    (`segment + segment`), so absent segments never leave a stray dot.
  */
  const {
    href,
    label,
    release,
    provider,
    country,
    social,
    sentiment,
    awardsCount,
    reactions,
    triviaCount,
  }: GlanceStripProps = $props();

  const providerLogo = $derived(
    provider
      ? useStreamingServiceLogo({ source: provider.source, country })
      : null,
  );

  const topReactionGlyphs = $derived(
    (reactions?.top ?? []).map(
      (sentimentKey) => reactionSentimentDefinitions[sentimentKey],
    ),
  );
</script>

<Link {href} color="inherit" {label}>
  <span class="trakt-glance-strip">
    {#if release}
      <span class="glance-segment glance-release">{release}</span>
    {/if}

    {#if provider}
      <span class="glance-segment">
        <span class="glance-provider-logo">
          <StreamingServiceLogo
            source={provider.source}
            {country}
            i18n={StreamingServiceLogoIntlProvider}
          />
        </span>
        {#if providerLogo}
          <span class="glance-provider-name">
            {$providerLogo?.name ?? provider.source}
          </span>
        {/if}
      </span>
    {/if}

    {#if social && social.count > 0}
      <RenderFor audience="authenticated">
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
      </RenderFor>
    {/if}

    {#if sentiment}
      <span
        class="glance-segment glance-sentiment"
        data-verdict={sentiment.verdict}
      >
        {sentiment.label}
      </span>
    {/if}

    {#if awardsCount > 0}
      <RenderForFeature flag={FeatureFlag.SummaryAwards} audience="director">
        {#snippet enabled()}
          <span class="glance-segment">
            <span class="glance-icon"><SparkleStarIcon /></span>
            {awardsCount}
          </span>
        {/snippet}
      </RenderForFeature>
    {/if}

    {#if reactions && reactions.total > 0}
      <RenderForFeature flag={FeatureFlag.Reactions} audience="director">
        {#snippet enabled()}
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
        {/snippet}
      </RenderForFeature>
    {/if}

    {#if triviaCount > 0}
      <span class="glance-segment">
        <span class="glance-icon glance-icon-trivia"><SparkleIcon /></span>
        {triviaCount}
      </span>
    {/if}
  </span>
</Link>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(a:has(> .trakt-glance-strip)) {
    text-decoration: none;
    border-radius: var(--border-radius-xl);
  }

  .trakt-glance-strip {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--gap-xs) var(--gap-s);

    padding: var(--ni-12) var(--ni-24);
    border-radius: var(--border-radius-xl);

    /* The header's glass recipe: permanent 6%, one step up under the cursor. */
    background-color: color-mix(
      in srgb,
      var(--color-foreground) 6%,
      transparent
    );
    border: var(--ni-1) solid var(--color-hairline);

    font-size: var(--font-size-text);
    color: var(--color-text-secondary);

    transition: background-color var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 10%,
          transparent
        );
      }
    }
  }

  :global(a:focus-visible) > .trakt-glance-strip {
    background-color: color-mix(
      in srgb,
      var(--color-foreground) 10%,
      transparent
    );
  }

  .glance-segment {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xxs);

    /*
      The separator belongs to the boundary, not to any segment - so a segment
      that does not render never strands a dot at an edge.
    */
    + .glance-segment::before {
      content: "·";
      margin-inline-end: var(--gap-s);
      color: var(--color-text-secondary);
    }
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

  .glance-sentiment {
    font-weight: 600;

    &[data-verdict="positive"] {
      color: var(--green-400);
    }

    &[data-verdict="mixed"] {
      color: var(--yellow-400);
    }

    &[data-verdict="negative"] {
      color: var(--red-400);
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
