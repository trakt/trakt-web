<script lang="ts">
  import { TestId } from "$e2e/models/TestId";
  import Button from "$lib/components/buttons/Button.svelte";
  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import { CookieConsentEndpoint } from "$lib/features/cookie-consent/CookieConsentEndpoint";
  import { useCookieConsent } from "$lib/features/cookie-consent/useCookieConsent";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { fade, slide } from "svelte/transition";

  const NOTICE_TRANSITION_DURATION = 150;

  const { hasConsent, setConsent } = useCookieConsent();

  const consent = async () => {
    await fetch(CookieConsentEndpoint.Consent, { method: "PUT" });
    setConsent(true);
  };
</script>

{#if !$hasConsent}
  <div
    class="trakt-cookie-underlay"
    transition:fade={{ duration: NOTICE_TRANSITION_DURATION }}
  ></div>
  <div
    class="trakt-cookie-notice"
    transition:slide={{ duration: NOTICE_TRANSITION_DURATION }}
  >
    <div class="trakt-cookie">🍪</div>
    <p class="meta-info">
      <MessageWithLink
        message={m.text_cookie_notice()}
        href={UrlBuilder.og.privacy()}
        target="_blank"
      />
    </p>
    <Button
      color="default"
      variant="secondary"
      size="small"
      label={m.button_label_cookie_accept()}
      onclick={consent}
      data-testid={TestId.ConsentButton}
    >
      {m.button_text_cookie_accept()}
    </Button>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-cookie-notice {
    --cookie-notice-distance-size: var(--ni-40);

    position: fixed;
    z-index: var(--layer-top);

    margin: auto;
    right: 0;
    left: 0;
    bottom: calc(
      var(--cookie-notice-distance-size) + env(safe-area-inset-bottom, 0)
    );

    display: flex;
    gap: var(--gap-m);

    border-radius: var(--border-radius-m);

    box-sizing: border-box;
    padding: var(--ni-24);
    padding-left: var(--ni-40);

    width: min(var(--ni-480), 85%);
    background-color: var(--color-cookie-background);
    box-shadow:
      0px 280px 78px 0px transparent,
      0px 179px 72px 0px var(--cm-shadow-2),
      0px 101px 60px 0px var(--cm-shadow-8),
      0px 45px 45px 0px var(--cm-shadow-14),
      0px 11px 25px 0px var(--cm-shadow-16);

    transition: var(--transition-increment) ease-in-out;
    transition-property: bottom, right, width;

    .trakt-cookie {
      --cookie-size: var(--ni-60);
      --cookie-half-size: calc(var(--cookie-size) / 2);
      --cookie-quarter-size: calc(var(--cookie-size) / 4);

      position: absolute;
      left: calc(-1 * var(--cookie-half-size));
      top: var(--cookie-quarter-size);

      font-size: 60px;
      line-height: 1;
    }

    backdrop-filter: blur(var(--ni-16));

    @include for-mobile {
      padding-left: var(--ni-24);
      padding-top: var(--ni-40);
      flex-direction: column;

      .trakt-cookie {
        position: absolute;
        left: calc(50% - var(--cookie-half-size));
        top: calc(-1 * var(--cookie-half-size));
      }
    }
  }

  .trakt-cookie-underlay {
    z-index: calc(var(--layer-top) - 1);

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background-color: var(--cm-background-cookie-notice);
    backdrop-filter: blur(var(--ni-8));
  }
</style>
