<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import StreamingServiceLogo from "$lib/components/media/streaming-service/StreamingServiceLogo.svelte";
  import { StreamingServiceLogoIntlProvider } from "$lib/components/media/streaming-service/StreamingServiceLogoIntlProvider";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { StreamingServiceOption } from "$lib/requests/models/StreamingServiceOptions";

  /*
    Where to watch as one control in the action tray: the lead service's own
    logo, bare, and a caret out to the full view. The logo is the answer, so
    it carries no words; the tooltip names the control and the link label
    names it for screen readers. One logo, not a fan: overlapped marks showed
    as clipped slivers, and the full view already lists the rest.

    With nothing to stream it keeps its place and says what it is, quietly:
    the full view still lets you look up other countries.
  */
  type DrawerLink = {
    href: string;
    noscroll?: boolean;
    replacestate?: boolean;
  };

  const {
    service,
    country,
    link,
  }: {
    service: StreamingServiceOption | null;
    country: string;
    link: DrawerLink;
  } = $props();

  const tooltip = $derived(
    service ? m.list_title_where_to_watch() : m.text_not_available_to_stream(),
  );
</script>

<Tooltip content={tooltip} variant="compact">
  <Link
    href={link.href}
    noscroll={link.noscroll}
    replacestate={link.replacestate}
    label={m.button_label_view_all_where_to_watch()}
    color="inherit"
  >
    <span class="trakt-summary-header-watch-chip">
      {#if service}
        <span class="watch-chip-mark">
          <StreamingServiceLogo
            source={service.source}
            {country}
            i18n={StreamingServiceLogoIntlProvider}
          />
        </span>
      {:else}
        <span class="watch-chip-label">{m.list_title_where_to_watch()}</span>
      {/if}

      <span class="watch-chip-caret" aria-hidden="true">
        <CaretRightIcon />
      </span>
    </span>
  </Link>
</Tooltip>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  /*
    The tray's own hover language: bare at rest, a pill of wash on hover, on
    the same box as the buttons beside it.
  */
  .trakt-summary-header-watch-chip {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);

    box-sizing: border-box;
    min-height: var(--action-button-size, var(--ni-48));
    padding-inline: var(--ni-12);
    border-radius: 999px;

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, transform;

    @include for-mouse {
      &:hover {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 10%,
          transparent
        );

        .watch-chip-caret {
          opacity: 0.9;
        }

        .watch-chip-label {
          color: var(--color-text-primary);
        }
      }
    }

    &:active {
      transform: scale(0.97);
    }
  }

  /*
    The logo sits bare in the tray, like the emoji, stars and heart beside
    it - a boxed tile was the one framed thing in the row. Every logo fits
    one box, so a wide wordmark and a square mark land at a similar weight.
  */
  .watch-chip-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;

    height: var(--ni-24);

    :global(.trakt-streaming-service-logo) {
      justify-content: center;
    }

    :global(.trakt-streaming-service-logo img) {
      width: auto;
      height: auto;
      max-width: var(--ni-64);
      max-height: var(--ni-22);
      object-fit: contain;

      /* API logos are drawn white; the light theme darkens them. */
      filter: var(--streaming-service-logo-filter);
    }

    :global(.trakt-streaming-service-logo svg) {
      width: auto;
      height: var(--ni-22);
      max-width: var(--ni-64);
    }

    :global(.trakt-channel-separator),
    :global(.trakt-channel-logo) {
      display: none;
    }

    :global(.trakt-streaming-service-logo span) {
      max-width: var(--ni-80);
      font-size: var(--font-size-tag);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  /* Two classes deep: Link pins the colour of spans inside it at (0,2,1). */
  .trakt-summary-header-watch-chip .watch-chip-label {
    font-size: var(--font-size-text-small);
    font-weight: 600;
    line-height: var(--ni-24);
    white-space: nowrap;
    color: var(--color-text-secondary);

    transition: color var(--transition-increment) ease-out;
  }

  .watch-chip-caret {
    display: inline-flex;
    align-items: center;

    color: var(--color-text-primary);
    opacity: 0.55;
    transition: opacity var(--transition-increment) ease-out;

    font-size: var(--font-size-text);

    :global(svg) {
      height: 1em;
      width: auto;
    }
  }
</style>
