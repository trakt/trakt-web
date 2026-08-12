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
  import type { GlanceDockProps } from "./GlanceDockProps.ts";
  import type { Snippet } from "svelte";

  /*
    The dock: everything this title has, in one glimpse, floating where the
    strip's divider used to rule. Tokens whose section is on screen in the
    carousel below wear the dock's running-app dot and step up to primary;
    the rest stay quiet but present. Hovering lifts a token the way the
    macOS dock rises to meet the pointer - two pixels, not a wave - and the
    tooltip is its dock label.
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
    recap,
    visibleKeys,
  }: GlanceDockProps = $props();

  const topReactionGlyphs = $derived(
    (reactions?.top ?? []).map(
      (sentimentKey) => reactionSentimentDefinitions[sentimentKey],
    ),
  );
</script>

{#snippet token(
  key: string,
  href: string,
  label: string,
  content: Snippet,
)}
  <Tooltip content={label} variant="compact">
    <Link {href} color="inherit" {label}>
      <span class="dock-token" data-visible={visibleKeys.has(key)}>
        {@render content()}
        <span class="dock-dot" aria-hidden="true"></span>
      </span>
    </Link>
  </Tooltip>
{/snippet}

<div class="trakt-glance-dock">
  <span class="dock-surface">
    {#if release}
      {#snippet releaseContent()}
        <span class="dock-release">{release}</span>
      {/snippet}
      {@render token(
        "details",
        links.details,
        m.button_label_details({ title }),
        releaseContent,
      )}
    {/if}

    {#if provider}
      {#snippet providerContent()}
        <span class="dock-provider-logo">
          <StreamingServiceLogo
            source={provider.source}
            {country}
            i18n={StreamingServiceLogoIntlProvider}
          />
        </span>
      {/snippet}
      {@render token(
        "watch",
        links.whereToWatch,
        m.button_label_view_all_where_to_watch(),
        providerContent,
      )}
    {/if}

    {#if social && social.count > 0}
      {#snippet socialContent()}
        <span class="dock-avatars">
          {#each social.users as user (user.slug)}
            <span class="dock-avatar">
              <UserAvatar {user} size="small" />
            </span>
          {/each}
        </span>
        {social.count}
      {/snippet}
      <RenderFor audience="authenticated">
        {@render token(
          "social",
          links.social,
          m.button_label_view_all_social_activity(),
          socialContent,
        )}
      </RenderFor>
    {/if}

    {#if recap}
      {#snippet recapContent()}
        {#if recap.remaining > 0}
          <span class="dock-recap" data-standing="behind">
            {m.text_recap_behind({ count: recap.remaining })}
          </span>
        {:else}
          <span class="dock-recap" data-standing="current">
            {m.text_recap_caught_up()}
          </span>
        {/if}
      {/snippet}
      <RenderFor audience="authenticated">
        {@render token(
          "recap",
          links.recap,
          m.button_label_view_recap({ title }),
          recapContent,
        )}
      </RenderFor>
    {/if}

    {#if sentiment}
      {#snippet sentimentContent()}
        <span class="dock-sentiment" data-verdict={sentiment.verdict}>
          {sentiment.label}
        </span>
      {/snippet}
      {@render token(
        "sentiment",
        links.sentiment,
        m.button_label_view_sentiment_analysis(),
        sentimentContent,
      )}
    {/if}

    {#if triviaCount > 0}
      {#snippet triviaContent()}
        <span class="dock-icon dock-icon-trivia"><SparkleIcon /></span>
        {m.text_glance_fact_count({ count: triviaCount })}
      {/snippet}
      {@render token(
        "trivia",
        links.trivia,
        m.button_label_view_trivia(),
        triviaContent,
      )}
    {/if}

    {#if awardsCount > 0}
      <RenderForFeature flag={FeatureFlag.SummaryAwards} audience="director">
        {#snippet enabled()}
          {#snippet awardsContent()}
            <span class="dock-icon"><TrophyIcon /></span>
            {awardsCount}
          {/snippet}
          {@render token(
            "awards",
            links.awards,
            m.button_label_view_awards({ title }),
            awardsContent,
          )}
        {/snippet}
      </RenderForFeature>
    {/if}

    {#if reactions && reactions.total > 0}
      <RenderForFeature flag={FeatureFlag.Reactions} audience="director">
        {#snippet enabled()}
          {#snippet reactionsContent()}
            <span class="dock-glyphs">
              {#each topReactionGlyphs as definition, index (definition.glyph)}
                <span
                  class="dock-glyph"
                  style:z-index={topReactionGlyphs.length - index}
                  role="img"
                  aria-label={definition.label()}
                >
                  {definition.glyph}
                </span>
              {/each}
            </span>
            {reactions.total}
          {/snippet}
          {@render token(
            "reactions",
            links.reactions,
            m.button_label_view_reactions({ title }),
            reactionsContent,
          )}
        {/snippet}
      </RenderForFeature>
    {/if}
  </span>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-glance-dock {
    display: flex;
    justify-content: center;
  }

  .dock-surface {
    display: inline-flex;
    /*
      Stretch, not center: tokens of different content heights (a sentiment
      pill vs a line of text) get one shared height, so every token's bottom
      is flush - and the running-app dots land on one baseline instead of
      wobbling with each token's own edge.
    */
    align-items: stretch;
    gap: var(--gap-xxs);

    padding: var(--ni-6);
    border-radius: var(--border-radius-xl);

    background-color: color-mix(
      in srgb,
      var(--color-foreground) 6%,
      transparent
    );
    border: var(--ni-1) solid var(--color-hairline);

    font-size: var(--font-size-text);
    color: var(--color-text-secondary);

    /* Every layer of the wrapper chain passes the stretch down. */
    :global(.trakt-tooltip-trigger) {
      display: flex;
    }

    :global(a) {
      text-decoration: none;
      display: flex;
      color: inherit;
    }

    /*
      The rise: the token comes up two pixels to meet the pointer - a nod to
      the dock's magnification, not an impression of it.
    */
    :global(a:hover .dock-token),
    :global(a:focus-visible .dock-token) {
      transform: translateY(calc(-1 * var(--ni-2)));
      background-color: color-mix(
        in srgb,
        var(--color-foreground) 10%,
        transparent
      );
      color: var(--color-text-primary);
    }

    @media (prefers-reduced-motion: reduce) {
      :global(a:hover .dock-token),
      :global(a:focus-visible .dock-token) {
        transform: none;
      }
    }
  }

  .dock-token {
    position: relative;

    display: inline-flex;
    align-items: center;
    gap: var(--gap-xxs);

    padding: var(--ni-6) var(--ni-10) var(--ni-8);
    border-radius: var(--border-radius-m);

    transition:
      transform var(--transition-increment) ease-out,
      background-color var(--transition-increment) ease-in-out,
      color var(--transition-increment) ease-in-out;

    /*
      The running-app dot: on when the token's section is on screen in the
      carousel below. The correlation IS the feature - lit dots say "you are
      looking at these", the unlit rest say "and this is also here".
    */
    .dock-dot {
      position: absolute;
      bottom: var(--ni-1);
      left: 50%;
      transform: translateX(-50%);

      width: var(--ni-3, 3px);
      height: var(--ni-3, 3px);
      border-radius: 999px;

      background: transparent;
      transition: background-color var(--transition-increment) ease-in-out;
    }

    &[data-visible="true"] {
      color: var(--color-text-primary);

      .dock-dot {
        background: var(--purple-300);
      }
    }
  }

  .dock-release {
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: var(--font-size-tag);
    font-weight: 600;
  }

  .dock-provider-logo {
    display: inline-flex;
    align-items: center;

    :global(svg),
    :global(img) {
      height: var(--ni-20);
      width: auto;
    }
  }

  .dock-avatars {
    display: inline-flex;
    align-items: center;
  }

  .dock-avatar {
    display: inline-flex;

    &:not(:first-child) {
      margin-inline-start: calc(-1 * var(--ni-6));
    }

    :global(.trakt-user-avatar) {
      width: var(--ni-20);
      height: var(--ni-20);
      border: var(--ni-1) solid var(--color-background);
    }
  }

  /* The viewer's standing, in its standing's colour. */
  .dock-recap {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;

    &[data-standing="behind"] {
      color: var(--orange-400);
    }

    &[data-standing="current"] {
      color: var(--green-400);
    }
  }

  .dock-sentiment {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;

    padding: var(--ni-2) var(--ni-8);
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

  .dock-icon {
    display: inline-flex;
    align-items: center;

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }

  .dock-icon-trivia {
    color: var(--purple-300);
  }

  .dock-glyphs {
    display: inline-flex;
    align-items: center;
  }

  .dock-glyph {
    font-size: var(--ni-14);
    line-height: 1;

    &:not(:first-child) {
      margin-inline-start: calc(-1 * var(--ni-4));
    }
  }
</style>
