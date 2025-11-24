<script lang="ts">
  import { TestId } from "$e2e/models/TestId";
  import Button from "$lib/components/buttons/Button.svelte";
  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import { CookieConsentEndpoint } from "$lib/features/cookie-consent/CookieConsentEndpoint";
  import type { CookieConsent } from "$lib/features/cookie-consent/models/CookieConsent";
  import { useCookieConsent } from "$lib/features/cookie-consent/useCookieConsent";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { WorkerMessage } from "$worker/WorkerMessage";
  import { workerRequest } from "$worker/workerRequest";
  import { fade, slide } from "svelte/transition";

  const NOTICE_TRANSITION_DURATION = 150;

  const { consent, setConsent } = useCookieConsent();

  const giveConsent = async (value: CookieConsent) => {
    setConsent(value);

    await fetch(CookieConsentEndpoint.Consent, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consent: value }),
    });

    await workerRequest(WorkerMessage.CacheBust);
  };
</script>

{#if !$consent || $consent === "none"}
  <div
    class="trakt-cookie-underlay"
    transition:fade={{ duration: NOTICE_TRANSITION_DURATION }}
  ></div>
  <div
    class="trakt-cookie-notice"
    transition:slide={{ duration: NOTICE_TRANSITION_DURATION }}
  >
    <div class="trakt-cookie">🍪</div>
    <p>
      <MessageWithLink
        message={m.text_cookie_notice()}
        href={UrlBuilder.og.privacy()}
        target="_blank"
      />
    </p>
    <div class="trakt-cookie-actions">
      <Button
        color="default"
        variant="primary"
        size="small"
        label={m.button_label_cookie_accept_functional_only()}
        onclick={() => giveConsent("functional")}
      >
        {m.button_text_cookie_accept_functional_only()}
      </Button>
      <Button
        color="purple"
        variant="primary"
        size="small"
        label={m.button_label_cookie_accept()}
        onclick={() => giveConsent("all")}
        data-testid={TestId.ConsentButton}
      >
        {m.button_text_cookie_accept()}
      </Button>
    </div>
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
      0px 179px 72px 0px
        color-mix(in srgb, var(--color-shadow) 16%, transparent),
      0px 101px 60px 0px color-mix(in srgb, var(--color-shadow) 8%, transparent),
      0px 45px 45px 0px color-mix(in srgb, var(--color-shadow) 14%, transparent),
      0px 11px 25px 0px color-mix(in srgb, var(--color-shadow) 16%, transparent);

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

  .trakt-cookie-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    @include for-mobile {
      align-items: normal;
      flex-direction: column-reverse;
    }
  }

  .trakt-cookie-underlay {
    z-index: calc(var(--layer-top) - 1);

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background-color: color-mix(
      in srgb,
      var(--color-cookie-background) 70%,
      transparent 30%
    );
    backdrop-filter: blur(var(--ni-8));
  }
</style>
