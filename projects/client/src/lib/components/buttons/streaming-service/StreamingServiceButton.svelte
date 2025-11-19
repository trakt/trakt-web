<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import { StreamingServiceLogoIntlProvider } from "$lib/components/media/streaming-service/StreamingServiceLogoIntlProvider";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences";
  import StreamingServiceLogo from "../../media/streaming-service/StreamingServiceLogo.svelte";
  import Button from "../Button.svelte";
  import { StreamingServiceButtonIntlProvider } from "./StreamingServiceButtonIntlProvider";
  import type { StreamingServiceButtonProps } from "./StreamingServiceButtonProps";

  const {
    mediaTitle,
    service,
    style,
    i18n = StreamingServiceButtonIntlProvider,
    size = "small",
    ...props
  }: StreamingServiceButtonProps = $props();

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: i18n.title(mediaTitle),
    color: "purple",
    variant: "primary",
    target: "_blank",
    navigationType: DpadNavigationType.Item,
  });

  const { country } = useStreamingPreferences();

  const { track } = useTrack(AnalyticsEvent.StreamOn);
  const handler = $derived({
    href: service.link,
    onclick: () => track({ source: service.source }),
  });
</script>

{#if style === "normal"}
  <div
    class="trakt-streaming-service-button"
    data-dpad-navigation={DpadNavigationType.List}
  >
    <Button {...commonProps} {...props} {...handler} {size}>
      {i18n.streamOn()}
      {#snippet icon()}
        <StreamingServiceLogo
          source={service.source}
          country={$country}
          i18n={StreamingServiceLogoIntlProvider}
        />
        <PlayIcon />
      {/snippet}
    </Button>
  </div>
{/if}

{#if style === "logo"}
  <div class="trakt-streaming-service-button">
    <Button {...commonProps} {...props} {...handler} {size}>
      <StreamingServiceLogo
        source={service.source}
        country={$country}
        i18n={StreamingServiceLogoIntlProvider}
      />
      {#snippet icon()}
        <PlayIcon />
      {/snippet}
    </Button>
  </div>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem {...commonProps} style="flat">
    <StreamingServiceLogo
      source={service.source}
      country={$country}
      i18n={StreamingServiceLogoIntlProvider}
    />
    {#snippet icon()}
      <PlayIcon />
    {/snippet}
  </DropdownItem>
{/if}

<style>
  .trakt-streaming-service-button {
    display: contents;

    :global(.trakt-button) {
      :global(.trakt-streaming-service-logo) {
        transition: transform var(--transition-increment) ease-in-out;
      }

      &:hover,
      &:focus-visible {
        :global(.trakt-streaming-service-logo) {
          filter: drop-shadow(0 var(--ni-40) 0 var(--color-background-purple));
          transform: translateY(var(--ni-neg-40));
        }
      }
    }
  }
</style>
