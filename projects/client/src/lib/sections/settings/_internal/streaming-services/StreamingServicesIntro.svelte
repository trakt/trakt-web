<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
</script>

<div class="trakt-streaming-services-intro">
  <div class="intro-title">
    <p class="settings-title bold">{m.header_streaming_sync()}</p>
    <span class="tag beta">{m.badge_text_beta()}</span>
  </div>
  <p class="secondary">{m.description_streaming_sync()}</p>
</div>

<style lang="scss">
  .trakt-streaming-services-intro {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    padding-inline: var(--gap-m);
  }

  .intro-title {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    p.settings-title {
      font-size: var(--font-size-title);
      text-transform: capitalize;
    }
  }

  span.tag.beta {
    padding: var(--ni-2) var(--ni-8);
    border-radius: var(--border-radius-s);

    background-color: color-mix(
      in srgb,
      var(--color-link-active) 16%,
      transparent
    );
    color: var(--color-link-active);

    font-size: var(--font-size-tag);
    text-transform: uppercase;
  }
</style>
