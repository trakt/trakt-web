<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import SettingsSection from "../SettingsSection.svelte";

  const { children }: ChildrenProps = $props();
</script>

<SettingsSection
  title={m.header_streaming_sync()}
  description={m.description_streaming_sync()}
>
  {#snippet badge()}
    <span class="tag beta">{m.badge_text_beta()}</span>
  {/snippet}

  {@render children()}
</SettingsSection>

<style lang="scss">
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
