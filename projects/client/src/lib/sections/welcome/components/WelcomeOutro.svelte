<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import PopcornIcon from "$lib/components/icons/PopcornIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import WelcomeVipUpsell from "./WelcomeVipUpsell.svelte";
</script>

<div class="trakt-welcome-outro">
  <h1 class="welcome-outro-heading bold">{m.welcome_outro_heading()}</h1>

  <div class="welcome-outro-actions">
    <WelcomeVipUpsell />

    <Button
      href={UrlBuilder.home()}
      color="default"
      variant="primary"
      style="flat"
      size="small"
      label={m.welcome_get_started()}
    >
      {m.welcome_get_started()}
      {#snippet icon()}
        <PopcornIcon />
      {/snippet}
    </Button>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-welcome-outro {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;

    gap: var(--gap-s);

    width: 100%;
    padding-block-start: var(--gap-xxl);

    /* Fading hairline: crisp in the middle, dissolves toward both edges. */
    &::before {
      content: "";
      position: absolute;
      inset-block-start: 0;
      inset-inline: 0;

      height: var(--ni-1);
      pointer-events: none;

      background: linear-gradient(
        to right,
        transparent,
        color-mix(in srgb, var(--purple-500) 60%, transparent) 50%,
        transparent
      );
    }

    /* Soft purple bloom sitting on the line for a supreme, lit-from-within feel. */
    &::after {
      content: "";
      position: absolute;
      inset-block-start: 0;
      inset-inline: 50%;
      translate: -50% -50%;

      width: min(var(--ni-320), 60%);
      height: var(--ni-64);
      pointer-events: none;

      background: radial-gradient(
        60% 100% at 50% 50%,
        color-mix(in srgb, var(--purple-500) 22%, transparent),
        transparent 70%
      );
    }
  }

  .welcome-outro-actions {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    justify-content: center;

    margin-block-start: var(--gap-s);

    max-width: var(--ni-320);
  }

  .welcome-outro-heading {
    font-size: var(--ni-32);
    line-height: 1.1;
    letter-spacing: -0.02em;

    transition: font-size var(--transition-increment) ease-in-out;

    @include for-mobile {
      font-size: var(--ni-28);
    }
  }
</style>
