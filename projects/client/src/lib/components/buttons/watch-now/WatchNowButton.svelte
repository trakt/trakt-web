<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import type { WatchNowButtonIntl } from "./WatchNowButtonIntl";
  import { WatchNowButtonIntlProvider } from "./WatchNowButtonIntlProvider";

  type WatchNowButtonProps = {
    isLoading: boolean;
    mediaTitle: string;
    streamingLink?: string;
    i18n?: WatchNowButtonIntl;
  };

  const {
    isLoading,
    mediaTitle,
    streamingLink,
    i18n = WatchNowButtonIntlProvider,
  }: WatchNowButtonProps = $props();

  const isDisabled = $derived(isLoading || !streamingLink);

  /*
    TODO:
    - source icon (either query buttonpng's from OG, or add SVG's for well known services)
    - 4k tag
    - Add proper tooltips
  */

  /*
    For now we use the title as a quick way to show a tooltip
    The label is used over the title when calculating
    the accessible name (https://www.w3.org/TR/wai-aria/#namecalculation)
  */
  const title = $derived(i18n.title({ title: mediaTitle, isDisabled }));
</script>

<Button
  {title}
  label={title}
  href={streamingLink}
  disabled={isDisabled || undefined}
  style="textured"
  color="purple"
  target="_blank"
>
  {i18n.text()}
  {#snippet icon()}
    <PlayIcon />
  {/snippet}
</Button>
