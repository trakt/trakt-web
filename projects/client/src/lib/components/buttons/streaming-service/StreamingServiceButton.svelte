<script lang="ts">
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import { StreamingServiceLogoIntlProvider } from "$lib/components/media/streaming-service/StreamingServiceLogoIntlProvider";
  import StreamingServiceLogo from "../../media/streaming-service/StreamingServiceLogo.svelte";
  import ActionButton from "../ActionButton.svelte";
  import Button from "../Button.svelte";
  import { StreamingServiceButtonIntlProvider } from "./StreamingServiceButtonIntlProvider";
  import type { StreamingServiceButtonProps } from "./StreamingServiceButtonProps";

  const {
    mediaTitle,
    service,
    style,
    i18n = StreamingServiceButtonIntlProvider,
    ...props
  }: StreamingServiceButtonProps = $props();

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: i18n.title(mediaTitle),
    color: "purple",
    variant: "primary",
    href: service.link,
    target: "_blank",
  });

  /**
   * TODO: @seferturan
   *
   * Let's replace this streaming service button with actionable tags on the cover (eg: Netflix, Prime Video, etc.)
   * TV apps should go with actionable button, web and mobile should go with tags on the cover.
   */
</script>

{#if style === "normal"}
  <div class="trakt-streaming-service-button">
    <Button {...commonProps} {...props} size="small">
      {i18n.streamOn()}
      {#snippet icon()}
        <StreamingServiceLogo
          source={service.source}
          i18n={StreamingServiceLogoIntlProvider}
        />
        <PlayIcon />
      {/snippet}
    </Button>
  </div>
{/if}

{#if style === "action"}
  <ActionButton {...commonProps} {...props} variant="secondary">
    <PlayIcon />
  </ActionButton>
{/if}

<style>
  .trakt-streaming-service-button {
    :global(.trakt-button) {
      :global(.trakt-streaming-service-logo) {
        transition: transform var(--transition-increment) ease-in-out;
      }

      &:hover {
        :global(.trakt-streaming-service-logo) {
          filter: drop-shadow(0 var(--ni-40) 0 var(--color-background-purple));
          transform: translateY(var(--ni-neg-40));
        }
      }
    }
  }
</style>
