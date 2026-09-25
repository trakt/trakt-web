<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  const PILLARS = [
    {
      key: "discover",
      eyebrow: m.text_landing_discover_eyebrow,
      label: m.header_landing_discover,
      description: m.text_landing_discover,
    },
    {
      key: "track",
      eyebrow: m.text_landing_track_eyebrow,
      label: m.header_landing_track,
      description: m.text_landing_track,
    },
    {
      key: "share",
      eyebrow: m.text_landing_share_eyebrow,
      label: m.header_landing_share,
      description: m.text_landing_share,
    },
  ] as const;
</script>

<section class="trakt-landing-pillars">
  {#each PILLARS as pillar (pillar.key)}
    <article class="pillar">
      <span class="pillar-eyebrow tag bold uppercase">{pillar.eyebrow()}</span>
      <h2 class="pillar-label">{pillar.label()}</h2>
      <p class="pillar-description capitalize">{pillar.description()}</p>
    </article>
  {/each}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-landing-pillars {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));

    border-block: var(--ni-1) solid var(--landing-color-border);

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .pillar {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--ni-56) var(--ni-48);

    & + & {
      border-inline-start: var(--ni-1) solid var(--landing-color-border);
    }

    @include for-tablet-lg-and-below {
      padding: var(--ni-40) var(--ni-32);
    }

    @include for-tablet-sm-and-below {
      padding: var(--ni-32) var(--ni-20);

      & + & {
        border-inline-start: none;
        border-top: var(--ni-1) solid var(--landing-color-border);
      }
    }
  }

  .pillar-eyebrow {
    letter-spacing: 0.08em;
    color: var(--landing-color-faint);
  }

  .pillar-label {
    font-size: var(--ni-64);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.035em;
    text-transform: lowercase;

    &::after {
      content: ".";
      color: var(--purple-400);
    }

    @include for-tablet-lg-and-below {
      font-size: var(--ni-48);
    }
  }

  .pillar-description {
    max-width: var(--ni-320);

    font-size: var(--ni-16);
    color: var(--landing-color-muted);
  }
</style>
