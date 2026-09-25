<script lang="ts">
  import NoveltySwitch from "$lib/components/toggles/NoveltySwitch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ChristmasIcon from "../icons/ChristmasIcon.svelte";

  const { isEnabled, onToggle }: { isEnabled: boolean; onToggle: () => void } =
    $props();
</script>

<div class="trakt-christmas-toggle">
  <NoveltySwitch
    label={m.switch_label_toggle_christmas_filters()}
    innerText={isEnabled ? "santa" : "grinch"}
    checked={isEnabled}
    color="red"
    onclick={onToggle}
  >
    {#snippet icon()}
      <ChristmasIcon />
    {/snippet}
  </NoveltySwitch>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-christmas-toggle {
    --custom-width: var(--ni-80);

    @include for-tablet-sm-and-below {
      --custom-width: var(--ni-74);
    }
  }
</style>
