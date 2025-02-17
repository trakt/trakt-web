<script lang="ts">
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import { WatchNowServiceLogoIntlProvider } from "$lib/components/media/watch-now/WatchNowServiceLogoIntlProvider";
  import WatchNowServiceLogo from "../../media/watch-now/WatchNowServiceLogo.svelte";
  import ActionButton from "../ActionButton.svelte";
  import Button from "../Button.svelte";
  import { WatchNowButtonIntlProvider } from "./WatchNowButtonIntlProvider";
  import type { WatchNowButtonProps } from "./WatchNowButtonProps";

  const {
    mediaTitle,
    service,
    style,
    i18n = WatchNowButtonIntlProvider,
    ...props
  }: WatchNowButtonProps = $props();

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
   * Let's replace this watch now button with actionable tags on the cover (eg: Netflix, Prime Video, etc.)
   * TV apps should go with actionable button, web and mobile should go with tags on the cover.
   */
</script>

{#if style === "normal"}
  <div class="trakt-watch-now-button">
    <Button {...commonProps} {...props} size="small">
      {i18n.streamOn()}
      {#snippet icon()}
        <WatchNowServiceLogo
          source={service.source}
          i18n={WatchNowServiceLogoIntlProvider}
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
  .trakt-watch-now-button {
    :global(.trakt-button) {
      :global(.trakt-watch-now-service-logo) {
        transition: transform var(--transition-increment) ease-in-out;
      }

      &:hover {
        :global(.trakt-watch-now-service-logo) {
          filter: drop-shadow(0 var(--ni-40) 0 var(--color-background-purple));
          transform: translateY(var(--ni-neg-40));
        }
      }
    }
  }
</style>
