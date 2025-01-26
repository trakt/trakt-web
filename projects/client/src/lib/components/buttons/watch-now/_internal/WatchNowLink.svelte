<script lang="ts">
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import WatchNowServiceLogo from "$lib/components/media/watch-now/WatchNowServiceLogo.svelte";
  import type { WatchNowStreaming } from "$lib/requests/models/WatchNowServices";
  import Button from "../../Button.svelte";
  import type { WatchNowButtonIntl } from "../WatchNowButtonIntl";

  type WatchNowButtonProps = {
    mediaTitle: string;
    service: WatchNowStreaming;
    i18n: WatchNowButtonIntl;
    isLoading: boolean;
  };

  const { mediaTitle, service, i18n, isLoading }: WatchNowButtonProps =
    $props();

  /*
    TODO:
    - 4k tag
  */
</script>

<Button
  label={i18n.title(mediaTitle)}
  href={service.link}
  disabled={isLoading || undefined}
  style="textured"
  color="purple"
  target="_blank"
>
  {i18n.watchNow()}
  {#snippet icon()}
    <WatchNowServiceLogo source={service.source} {i18n} />
    <PlayIcon />
  {/snippet}
</Button>
