<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CodeIcon from "$lib/components/icons/CodeIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
</script>

<div class="trakt-api-applications-moved-notice">
  <span class="notice-cue" aria-hidden="true">
    <CodeIcon />
  </span>

  <div class="notice-copy">
    <p class="trakt-card-title bold">{m.heading_api_applications_moved()}</p>
    <p class="tag secondary">{m.text_api_applications_moved()}</p>
  </div>

  <div class="notice-cta">
    <ActionButton
      href={UrlBuilder.developer.portal()}
      target="_blank"
      rel="noopener noreferrer"
      style="flat"
      color="purple"
      size="small"
      label={m.link_text_open_developer_portal()}
    >
      {m.link_text_open_developer_portal()}
    </ActionButton>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-api-applications-moved-notice {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    padding: var(--gap-m);
    border-radius: var(--border-radius-l);

    background: var(--color-card-background);
    border: var(--ni-1) solid var(--color-border);

    @include for-mobile {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--gap-s);
    }
  }

  .notice-copy {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    flex: 1;
  }

  .notice-cta {
    flex-shrink: 0;
  }
</style>
