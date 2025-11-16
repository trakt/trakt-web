<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import PlexLogo from "$lib/components/icons/PlexLogo.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { buildPlexLink } from "$lib/features/plex/buildPlexLink";
  import Button from "../Button.svelte";
  import { StreamingServiceButtonIntlProvider } from "../streaming-service/StreamingServiceButtonIntlProvider";
  import type { PlexButtonProps } from "./PlexButtonProps";

  const {
    target,
    style,
    size = "small",
    i18n = StreamingServiceButtonIntlProvider,
    ...props
  }: PlexButtonProps = $props();

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: i18n.title(target.media.title),
    color: "default",
    variant: "secondary",
    target: "_blank",
    navigationType: DpadNavigationType.Item,
  });

  const plexLink = $derived(buildPlexLink(target));

  const { track } = useTrack(AnalyticsEvent.StreamOn);
  const handler = $derived({
    href: plexLink,
    onclick: () => track({ source: "plex" }),
  });
</script>

{#if style === "normal"}
  <div class="trakt-plex-button" data-dpad-navigation={DpadNavigationType.List}>
    <Button {...commonProps} {...props} {...handler} {size}>
      {i18n.streamOn()}
      {#snippet icon()}
        <PlexLogo />
        <PlayIcon />
      {/snippet}
    </Button>
  </div>
{/if}

{#if style === "logo"}
  <div class="trakt-plex-button">
    <Button {...commonProps} {...props} {...handler} {size}>
      <PlexLogo />
      {#snippet icon()}
        <PlayIcon />
      {/snippet}
    </Button>
  </div>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem {...commonProps} style="flat">
    <PlexLogo />
    {#snippet icon()}
      <PlayIcon />
    {/snippet}
  </DropdownItem>
{/if}

<style>
  .trakt-plex-button {
    display: contents;

    :global(.button-label) {
      display: flex;
    }
  }
</style>
