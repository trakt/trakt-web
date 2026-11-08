<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { revealOnView } from "$lib/utils/actions/revealOnView.ts";

  const { onDownloadKit }: { onDownloadKit: () => void } = $props();

  const dos = [
    m.text_branding_req_1,
    m.text_branding_req_4,
    m.text_branding_req_6,
  ] as const;

  const donts = [
    m.text_branding_req_2,
    m.text_branding_req_3,
    m.text_branding_req_5,
  ] as const;
</script>

<section class="trakt-branding-requirements">
  <div class="branding-hero">
    <span class="branding-caps-label">{m.label_branding_press_kit()}</span>
    <h2 class="branding-section-heading">{m.heading_branding_hero()}</h2>
    <p class="secondary branding-hero-pitch">{m.text_branding_hero_pitch()}</p>
    <div class="branding-kit-pill">
      <Button
        label={m.button_label_branding_download_kit()}
        color="purple"
        variant="primary"
        size="small"
        onclick={onDownloadKit}
      >
        {m.button_text_branding_download_kit()}
      </Button>
    </div>
  </div>

  <div class="branding-rules">
    <div class="branding-rule-card" use:revealOnView>
      <span class="branding-caps-label" data-tone="accent">
        {m.heading_branding_do()}
      </span>
      <ul class="branding-requirements-list">
        {#each dos as requirement, index (index)}
          <li>{requirement()}</li>
        {/each}
      </ul>
    </div>
    <div class="branding-rule-card" use:revealOnView={{ delay: 80 }}>
      <span class="branding-caps-label">{m.heading_branding_dont()}</span>
      <ul class="branding-requirements-list" data-tone="muted">
        {#each donts as requirement, index (index)}
          <li>{requirement()}</li>
        {/each}
      </ul>
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-branding-requirements {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    width: 100%;
  }

  .branding-hero {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gap-s);

    padding: var(--gap-xl);
    border-radius: var(--border-radius-xxl);
    background: linear-gradient(
      160deg,
      color-mix(
        in srgb,
        var(--color-brand-violet) 18%,
        var(--color-card-background)
      ),
      var(--color-card-background)
    );
    backdrop-filter: blur(var(--ni-12));
    box-shadow: var(--shadow-floating);
  }

  .branding-hero-pitch {
    max-width: var(--ni-640);
    line-height: 1.6;
  }

  .branding-caps-label {
    font-size: var(--ni-12);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);

    &[data-tone="accent"] {
      color: var(--color-accent-purple);
    }
  }

  .branding-kit-pill {
    position: relative;
    display: inline-flex;
    margin-block-start: var(--gap-xs);
    border-radius: var(--border-radius-pill);

    &::after {
      content: "";
      position: absolute;
      inset: calc(-1 * var(--ni-2));
      border-radius: inherit;
      border: var(--border-thickness-xxs) solid var(--color-accent-purple);
      opacity: 0;
      pointer-events: none;
      animation: branding-kit-pulse 4s ease-in-out infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      &::after {
        animation: none;
      }
    }
  }

  @keyframes branding-kit-pulse {
    0%,
    60%,
    100% {
      opacity: 0;
      transform: scale(1);
    }

    75% {
      opacity: 0.9;
      transform: scale(1.04);
    }
  }

  .branding-rules {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--gap-m);

    @include for-mobile {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .branding-rule-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--gap-l);
    border-radius: var(--border-radius-xl);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);
  }

  .branding-requirements-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    margin: 0;
    padding: 0;
    list-style: none;

    &[data-tone="muted"] {
      color: var(--color-text-secondary);
    }

    li {
      font-size: var(--font-size-text);
      line-height: 1.6;
    }
  }
</style>
