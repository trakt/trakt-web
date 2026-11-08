<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import DiscoverIcon from "$lib/components/icons/DiscoverIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import SocialIcon from "$lib/components/icons/SocialIcon.svelte";
  import LogoMark from "$lib/components/logo/LogoMark.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { revealOnView } from "$lib/utils/actions/revealOnView.ts";

  const REVEAL_STEP = 80;
  const MAX_REVEAL_STEPS = 5;

  const features = [
    {
      icon: ShowIcon,
      title: m.about_feature_title_scrobble,
      description: m.about_feature_description_scrobble,
    },
    {
      icon: MovieIcon,
      title: m.about_feature_title_any_device,
      description: m.about_feature_description_any_device,
    },
    {
      icon: DiscoverIcon,
      title: m.about_feature_title_discover,
      description: m.about_feature_description_discover,
    },
    {
      icon: RatingIcon,
      title: m.about_feature_title_rate_review,
      description: m.about_feature_description_rate_review,
    },
    {
      icon: CalendarIcon,
      title: m.about_feature_title_calendar,
      description: m.about_feature_description_calendar,
    },
    {
      icon: SocialIcon,
      title: m.about_feature_title_community,
      description: m.about_feature_description_community,
    },
  ];
</script>

<section class="trakt-what-is-trakt">
  <div class="what-is-trakt-hero">
    <div class="what-is-trakt-logo">
      <LogoMark />
    </div>

    <div class="what-is-trakt-headline">
      <h2 class="what-is-trakt-heading">{m.heading_what_is_trakt()}</h2>
      <p class="what-is-trakt-tagline secondary">
        {m.text_about_tagline()}
      </p>
    </div>
  </div>

  <div class="what-is-trakt-features">
    {#each features as feature, i (i)}
      {@const Icon = feature.icon}
      <div
        class="trakt-feature-card"
        use:revealOnView={{
          delay: Math.min(i, MAX_REVEAL_STEPS) * REVEAL_STEP,
        }}
      >
        <div class="trakt-feature-icon">
          <Icon />
        </div>
        <div class="trakt-feature-content">
          <h3 class="trakt-feature-title">{feature.title()}</h3>
          <p class="secondary trakt-feature-description">
            {feature.description()}
          </p>
        </div>
      </div>
    {/each}
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-what-is-trakt {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxl);

    width: 100%;
  }

  .what-is-trakt-hero {
    display: grid;
    grid-template-columns: var(--ni-80) 1fr;
    gap: var(--gap-xl);
    align-items: start;

    @include for-mobile {
      grid-template-columns: 1fr;
      gap: var(--gap-m);
    }
  }

  .what-is-trakt-logo {
    --puck-size: var(--ni-80);

    position: relative;
    isolation: isolate;
    display: grid;
    place-items: center;

    width: var(--puck-size);
    height: var(--puck-size);

    border-radius: 50%;
    background: color-mix(in srgb, var(--color-foreground) 6%, transparent);
    box-shadow: var(--shadow-raised);

    animation: puck-in var(--transition-spring-duration)
      var(--transition-spring-ease) backwards;

    &::before {
      content: "";
      position: absolute;
      inset: calc(-1 * var(--ni-14));
      z-index: var(--layer-background);

      border-radius: 50%;
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--purple-500) 45%, transparent),
        transparent 68%
      );
      filter: blur(var(--ni-6));

      animation: aura-breathe 6s ease-in-out infinite;
    }

    :global(svg) {
      width: var(--ni-48);
      height: var(--ni-48);
    }

    @include for-mobile {
      --puck-size: var(--ni-72);
    }
  }

  .what-is-trakt-headline {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .what-is-trakt-heading {
    font-size: var(--ni-40);
    line-height: 1.1;
    transition: font-size var(--transition-increment) ease-in-out;

    animation: rise-in var(--transition-spring-duration) ease-out 120ms
      backwards;

    @include for-tablet-lg-and-below {
      font-size: var(--ni-32);
    }

    @include for-mobile {
      font-size: var(--ni-28);
    }
  }

  .what-is-trakt-tagline {
    font-size: var(--ni-18);
    line-height: 1.7;
    max-width: var(--ni-640);

    animation: rise-in var(--transition-spring-duration) ease-out 240ms
      backwards;

    @include for-mobile {
      font-size: var(--font-size-text);
    }
  }

  .what-is-trakt-features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--gap-m);

    @include for-tablet-lg-and-below {
      grid-template-columns: repeat(2, 1fr);
    }

    @include for-mobile {
      grid-template-columns: 1fr;
    }
  }

  .trakt-feature-card {
    display: flex;
    flex-direction: row;
    gap: var(--gap-m);
    align-items: center;

    padding: var(--ni-20) var(--gap-l);

    background: var(--color-card-background);
    border-radius: var(--border-radius-xl);
    box-shadow: var(--shadow-raised);
  }

  .trakt-feature-icon {
    flex-shrink: 0;
    display: grid;
    place-items: center;

    width: var(--ni-40);
    height: var(--ni-40);

    color: var(--color-text-primary);
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    border-radius: 50%;

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .trakt-feature-card:first-child .trakt-feature-icon {
    color: var(--purple-500);
    background: color-mix(in srgb, var(--purple-500) 22%, transparent);
  }

  .trakt-feature-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }

  .trakt-feature-title {
    font-weight: 600;
    font-size: var(--font-size-title);
  }

  .trakt-feature-description {
    font-size: var(--ni-12);
    line-height: 1.6;
  }

  @keyframes puck-in {
    from {
      opacity: 0;
      transform: scale(0.7);
    }
  }

  @keyframes aura-breathe {
    0%,
    100% {
      opacity: 0.45;
      transform: scale(0.95);
    }
    50% {
      opacity: 0.9;
      transform: scale(1.05);
    }
  }

  @keyframes rise-in {
    from {
      opacity: 0;
      transform: translateY(var(--ni-14));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .what-is-trakt-logo,
    .what-is-trakt-logo::before,
    .what-is-trakt-heading,
    .what-is-trakt-tagline {
      animation: none;
    }
  }
</style>
