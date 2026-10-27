<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";

  const PREVIEW_OPACITIES = [0.6, 0.4, 0.25];
</script>

<div class="trakt-recap-story-locked">
  <div class="locked-timeline" aria-hidden="true">
    {#each PREVIEW_OPACITIES as opacity (opacity)}
      <div class="locked-row" style="--locked-opacity: {opacity}">
        <span class="locked-node"></span>
        <span class="locked-card"></span>
      </div>
    {/each}
  </div>

  <UpsellCta source="season-recap" title={m.tab_text_recap_story()}>
    {m.text_recap_upsell_story()}
  </UpsellCta>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-recap-story-locked {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    .locked-timeline {
      position: relative;

      display: flex;
      flex-direction: column;
      gap: var(--gap-s);

      &::before {
        content: "";
        position: absolute;
        top: var(--ni-14);
        bottom: var(--ni-14);
        inset-inline-start: calc(var(--ni-28) / 2 - 1px);

        width: var(--ni-2);
        background-color: color-mix(
          in srgb,
          var(--color-text-primary) 14%,
          transparent
        );
      }
    }

    .locked-row {
      position: relative;

      display: flex;
      gap: var(--gap-s);

      opacity: var(--locked-opacity);

      @include spoiler-blur();
    }

    .locked-node {
      flex-shrink: 0;

      width: var(--ni-28);
      height: var(--ni-28);
      margin-top: var(--ni-10);

      border-radius: 50%;
      background-color: var(--purple-800);
      box-shadow: 0 0 0 var(--border-thickness-s) var(--color-card-background);
    }

    .locked-card {
      flex: 1;
      height: var(--ni-88);

      border-radius: var(--border-radius-m);
      background: color-mix(in srgb, var(--color-text-primary) 4%, transparent);
    }
  }
</style>
