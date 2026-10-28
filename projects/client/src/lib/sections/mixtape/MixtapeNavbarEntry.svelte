<script lang="ts">
  import CassetteIcon from "$lib/components/icons/CassetteIcon.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const { mode } = useDiscover();

  const href = $derived(
    UrlBuilder.mixtape({
      type: $mode === "show" ? "show" : "movie",
      source: "navbar",
    }),
  );
</script>

<div class="trakt-mixtape-navbar-entry">
  <Tooltip
    content={m.text_mixtape_strip_description()}
    variant="compact"
    side="bottom"
  >
    <Link
      {href}
      label={m.button_text_make_mixtape()}
      navigationType={DpadNavigationType.Item}
      color="inherit"
    >
      <span class="entry-icon"><CassetteIcon /></span>
      <span class="entry-label">{m.page_title_mixtape()}</span>
      <span class="entry-chip" aria-hidden="true"><PlusIcon /></span>
    </Link>
  </Tooltip>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-navbar-entry {
    --entry-inset-start: var(--ni-12);
    --entry-inset-end: calc(
      (var(--navbar-entry-size) - var(--navbar-entry-chip-size)) / 2
    );

    position: relative;
    display: grid;
    min-width: 0;
    border-radius: inherit;

    :global(.trakt-tooltip-trigger) {
      min-width: 0;
    }

    :global(.trakt-link) {
      @include navbar-entry-link;

      flex: 1;
    }

    .entry-icon {
      flex: none;
      display: flex;
      color: var(--color-text-emphasis);

      :global(svg) {
        width: var(--ni-20);
        height: var(--ni-20);
      }
    }

    .entry-label {
      flex: 1;
      font-weight: 500;
      white-space: nowrap;
    }

    .entry-chip {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;

      width: var(--navbar-entry-chip-size);
      height: var(--navbar-entry-chip-size);
      box-sizing: border-box;

      border-radius: var(--border-radius-pill);
      background: var(--color-navbar-entry-chip-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs)
        var(--color-navbar-entry-chip-ring);
      color: var(--color-navbar-entry-chip-text);

      :global(svg) {
        width: var(--ni-10);
        height: var(--ni-10);
      }

      :global(path) {
        stroke-width: 3;
      }
    }

    @include for-mobile {
      .entry-label {
        display: none;
      }

      .entry-chip {
        @include navbar-entry-corner-chip;
      }
    }
  }
</style>
