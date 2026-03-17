<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import DiscoverIcon from "$lib/components/icons/DiscoverIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import SocialIcon from "$lib/components/icons/SocialIcon.svelte";
  import LogoMark from "$lib/components/logo/LogoMark.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const FEATURES = [
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
    {#each FEATURES as feature, i (i)}
      {@const Icon = feature.icon}
      <div class="trakt-feature-card">
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
    }
  }

  .what-is-trakt-logo {
    :global(svg) {
      width: var(--ni-64);
      height: var(--ni-64);
    }

    @include for-mobile {
      display: none;
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
    align-items: flex-start;

    padding: var(--gap-l);

    background: color-mix(
      in srgb,
      var(--color-card-background) 80%,
      transparent
    );
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-border) 50%, transparent);
    border-radius: var(--border-radius-xl);

    transition:
      border-color var(--transition-increment) ease-in-out,
      background var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        border-color: color-mix(in srgb, var(--purple-500) 40%, transparent);
        background: color-mix(
          in srgb,
          var(--color-card-background) 95%,
          var(--purple-500) 5%
        );
      }
    }
  }

  .trakt-feature-icon {
    flex-shrink: 0;
    width: var(--ni-24);
    height: var(--ni-24);
    margin-top: var(--ni-2);

    color: var(--purple-500);

    :global(svg) {
      width: 100%;
      height: 100%;
    }
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
</style>
