<script lang="ts">
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";

  const { image, title, season, episodeCount, duration }: {
    image: HttpsUrl;
    title: string;
    season: number;
    episodeCount: number;
    duration: string | undefined;
  } = $props();
</script>

<header class="trakt-recap-hero">
  <div class="hero-backdrop" aria-hidden="true">
    <CrossOriginImage src={image} alt="" />
  </div>

  <div class="hero-copy">
    <div class="hero-chips">
      <span class="hero-chip bold">
        {m.text_recap_meta_pair({
          first: m.text_season_number({ number: season }),
          second: m.tag_text_number_of_episodes({ count: episodeCount }),
        })}
      </span>

      {#if duration}
        <span class="hero-chip secondary">
          <ClockIcon />
          {duration}
        </span>
      {:else}
        <span class="hero-chip">
          <Skeleton width="var(--ni-40)" height="var(--ni-10)" />
        </span>
      {/if}
    </div>

    <h2 class="hero-title">{m.header_season_recap({ title })}</h2>
  </div>
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-recap-hero {
    --recap-hero-height: var(--ni-180);
    --recap-hero-fade: var(--color-card-background);

    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    flex-shrink: 0;

    box-sizing: border-box;
    min-height: var(--recap-hero-height);
    margin-inline: calc(-1 * var(--drawer-padding));
    margin-top: calc(
      -1 * (var(--drawer-header-overlay-height) + var(--gap-xs))
    );
    padding: var(--gap-m) var(--drawer-padding) var(--gap-xs);

    @include for-mobile {
      --recap-hero-height: var(--ni-220);
    }

    .hero-backdrop {
      position: absolute;
      inset: 0;

      overflow: hidden;
      background-color: color-mix(
        in srgb,
        var(--color-text-primary) 8%,
        transparent
      );

      :global(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 50% 30%;
      }

      &::after {
        content: "";
        position: absolute;
        inset: 0;

        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--recap-hero-fade) 30%, transparent) 0%,
          transparent 35%,
          var(--recap-hero-fade) 100%
        );
      }
    }

    .hero-copy {
      position: relative;

      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
    }

    .hero-chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ni-8);
    }

    .hero-chip {
      display: inline-flex;
      align-items: center;
      gap: var(--gap-xxs);

      height: var(--ni-24);
      padding-inline: var(--ni-10);

      border-radius: var(--border-radius-pill);
      background: color-mix(in srgb, var(--shade-940) 72%, transparent);
      color: var(--shade-10);

      font-size: var(--font-size-text-small);

      &.secondary {
        color: var(--shade-300);
      }

      :global(svg) {
        width: var(--ni-12);
        height: var(--ni-12);
      }
    }

    .hero-title {
      font-size: var(--ni-24);
      line-height: 1.15;

      @include for-mobile {
        font-size: calc(var(--ni-24) + var(--ni-2));
      }
    }
  }
</style>
