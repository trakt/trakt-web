<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import Logo from "$lib/components/logo/Logo.svelte";
  import LogoText from "$lib/components/logo/LogoText.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { revealOnView } from "$lib/utils/actions/revealOnView.ts";
</script>

<section class="trakt-branding-clear-space" use:revealOnView>
  <h2 class="branding-section-heading">{m.heading_branding_clear_space()}</h2>
  <p class="secondary clear-space-desc">{m.text_branding_req_4()}</p>

  <div class="clear-space-stage">
    <div class="clear-space-zone">
      <span class="clear-space-tick bold">
        {m.text_branding_clear_space_measure()}
      </span>
      <div class="clear-space-logo">
        <Logo />
      </div>
    </div>
  </div>

  <div class="clear-space-examples">
    <div class="clear-space-example" data-verdict="approved">
      <span class="clear-space-glyph" aria-hidden="true"><CheckIcon /></span>
      <div class="clear-space-copy">
        <p class="bold">{m.text_branding_clear_space_approved()}</p>
        <p class="secondary small">
          {m.text_branding_clear_space_approved_detail()}
        </p>
      </div>
    </div>
    <div class="clear-space-example" data-verdict="misuse">
      <span class="clear-space-glyph" aria-hidden="true"><CloseIcon /></span>
      <div class="clear-space-copy">
        <p class="bold">{m.text_branding_clear_space_misuse()}</p>
        <div class="clear-space-misuse-logo" aria-hidden="true">
          <LogoText />
        </div>
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-branding-clear-space {
    --clear-space: var(--ni-32);

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    width: 100%;
  }

  .clear-space-desc {
    max-width: var(--ni-640);
    line-height: 1.6;
  }

  .clear-space-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: var(--ni-200);
    margin-block-start: var(--gap-s);
    padding: var(--gap-l);
    box-sizing: border-box;

    border-radius: var(--border-radius-xl);
    background: var(--branding-white);
    color: var(--branding-ink);
    box-shadow: var(--shadow-base);
  }

  .clear-space-zone {
    position: relative;
    padding: var(--clear-space);
    border-radius: var(--border-radius-m);

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      border: var(--border-thickness-xxs) dashed var(--color-brand-violet);
      animation: clear-space-fade 4s ease-in-out infinite;
    }
  }

  .clear-space-tick {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--clear-space);
    height: var(--clear-space);

    font-size: var(--ni-12);
    color: var(--color-brand-violet);
    animation: clear-space-fade 4s ease-in-out infinite;
  }

  .clear-space-logo {
    width: var(--ni-200);

    :global(svg) {
      width: 100%;
      height: auto;
    }
  }

  @keyframes clear-space-fade {
    0%,
    15% {
      opacity: 0;
    }

    30%,
    80% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .clear-space-zone::before,
    .clear-space-tick {
      animation: none;
      opacity: 1;
    }
  }

  .clear-space-examples {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--gap-m);

    @include for-mobile {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .clear-space-example {
    display: flex;
    align-items: flex-start;
    gap: var(--gap-s);
    min-height: var(--ni-96);
    padding: var(--gap-m);
    box-sizing: border-box;

    border-radius: var(--border-radius-xl);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);
  }

  .clear-space-glyph {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--ni-24);
    height: var(--ni-24);
    border-radius: 50%;

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }

    .clear-space-example[data-verdict="approved"] & {
      background: color-mix(in srgb, var(--green-500) 20%, transparent);
      color: var(--green-600);
    }

    .clear-space-example[data-verdict="misuse"] & {
      background: color-mix(in srgb, var(--red-600) 20%, transparent);
      color: var(--red-600);
    }
  }

  .clear-space-copy {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    min-width: 0;
  }

  .clear-space-misuse-logo {
    width: var(--ni-64);
    margin-block-start: var(--gap-xs);
    transform: rotate(-12deg);
    color: var(--color-text-secondary);

    :global(svg) {
      width: 100%;
      height: auto;
    }
  }
</style>
