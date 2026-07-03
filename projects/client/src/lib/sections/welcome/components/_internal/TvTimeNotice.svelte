<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { importSourceHref } from "./importSourceHref.ts";

  const TV_TIME_LIBERATOR_URL =
    "https://chromewebstore.google.com/detail/tv-time-liberator-extensi/pohobkcjhigehafgnhehkanhjakajhpm";
  const TV_TIME_GDPR_URL = "https://gdpr.tvtime.com/gdpr/self-service";

  const importHref = importSourceHref("tvtime");
</script>

<section class="trakt-tv-time-notice">
  <div class="tv-time-glow" aria-hidden="true"></div>

  <div class="tv-time-content">
    <span class="tv-time-badge">{m.welcome_tvtime_badge()}</span>

    <div class="tv-time-copy">
      <h3 class="tv-time-heading">{m.welcome_tvtime_heading()}</h3>
      <p class="tv-time-body">{m.welcome_tvtime_body()}</p>
    </div>

    <p class="secondary tv-time-liberator-note">
      {m.welcome_tvtime_liberator_body()}
    </p>

    <div class="tv-time-actions">
      <Button
        href={importHref}
        color="purple"
        variant="primary"
        style="flat"
        label={m.welcome_tvtime_import_cta()}
      >
        {m.welcome_tvtime_import_cta()}
      </Button>

      <Button
        href={TV_TIME_LIBERATOR_URL}
        target="_blank"
        rel="noopener noreferrer"
        color="default"
        variant="secondary"
        style="flat"
        label={m.welcome_tvtime_liberator_cta()}
      >
        {m.welcome_tvtime_liberator_cta()}
        {#snippet icon()}
          <ExternalLinkIcon size="small" />
        {/snippet}
      </Button>

      <Button
        href={TV_TIME_GDPR_URL}
        target="_blank"
        rel="noopener noreferrer"
        color="default"
        variant="secondary"
        style="flat"
        label={m.welcome_tvtime_gdpr_cta()}
      >
        {m.welcome_tvtime_gdpr_cta()}
        {#snippet icon()}
          <ExternalLinkIcon size="small" />
        {/snippet}
      </Button>
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-tv-time-notice {
    position: relative;
    overflow: hidden;

    padding: var(--gap-xl);

    background: color-mix(
      in srgb,
      var(--purple-500) 12%,
      var(--color-background)
    );
    border: var(--border-thickness-xs) solid
      color-mix(in srgb, var(--purple-500) 45%, transparent);
    border-radius: var(--border-radius-xl);

    box-shadow: var(--shadow-raised);
  }

  .tv-time-glow {
    position: absolute;
    inset-block-start: calc(-1 * var(--ni-160));
    inset-inline-end: calc(-1 * var(--ni-160));

    width: var(--ni-480);
    height: var(--ni-480);

    background: radial-gradient(
      circle at center,
      color-mix(in srgb, var(--purple-500) 34%, transparent) 0%,
      color-mix(in srgb, var(--purple-500) 14%, transparent) 40%,
      color-mix(in srgb, var(--purple-500) 4%, transparent) 64%,
      transparent 82%
    );

    pointer-events: none;
  }

  .tv-time-content {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    max-width: var(--ni-640);
  }

  .tv-time-badge {
    align-self: flex-start;

    padding: var(--ni-4) var(--ni-12);

    background: color-mix(in srgb, var(--purple-500) 30%, transparent);
    border-radius: var(--border-radius-m);

    color: var(--color-foreground);
    font-size: var(--font-size-tag);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .tv-time-copy {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .tv-time-heading {
    font-size: var(--ni-28);
    line-height: 1.15;

    @include for-mobile {
      font-size: var(--ni-24);
    }
  }

  .tv-time-body {
    font-size: var(--ni-16);
    line-height: 1.6;
  }

  .tv-time-liberator-note {
    font-size: var(--font-size-text);
    line-height: 1.6;
  }

  .tv-time-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-m);

    margin-block-start: var(--gap-xs);
  }
</style>
