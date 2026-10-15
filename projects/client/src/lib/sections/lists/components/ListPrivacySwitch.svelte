<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ListPrivacySwitchProps } from "./ListPrivacySwitchProps.ts";

  const {
    privacy,
    disabled = false,
    hasLegacyState = false,
    onChange,
  }: ListPrivacySwitchProps = $props();

  const isLegacy = $derived(
    hasLegacyState && privacy !== "public" && privacy !== "private",
  );
</script>

<div class="trakt-list-privacy-switch">
  <span class="secondary">{m.text_private()}</span>
  <Switch
    label={m.switch_label_toggle_list_privacy()}
    checked={privacy === "private"}
    indeterminate={isLegacy}
    {disabled}
    onclick={() => onChange(privacy === "private" ? "public" : "private")}
  />
</div>

<style>
  .trakt-list-privacy-switch {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--gap-xs);

    margin-inline-start: auto;
  }
</style>
