<script lang="ts">
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import type { WatchNowStreaming } from "$lib/requests/models/WatchNowServices";
  import Button from "../../Button.svelte";
  import type { WatchNowButtonIntl } from "../WatchNowButtonIntl";
  import WatchNowServiceLogo from "./WatchNowServiceLogo.svelte";

  type WatchNowButtonProps = {
    mediaTitle: string;
    favoriteService: WatchNowStreaming;
    i18n: WatchNowButtonIntl;
    isLoading: boolean;
  };

  const { mediaTitle, favoriteService, i18n, isLoading }: WatchNowButtonProps =
    $props();

  /*
    TODO:
    - 4k tag
  */
</script>

<Button
  label={i18n.title(mediaTitle)}
  href={favoriteService.link}
  disabled={isLoading || undefined}
  style="textured"
  color="purple"
  target="_blank"
>
  {i18n.watchNow()}
  {#snippet icon()}
    <WatchNowServiceLogo source={favoriteService.source} {i18n} />
    <PlayIcon />
  {/snippet}
</Button>
