<script lang="ts">
  import { useStreamOnHandler } from "$lib/components/buttons/streaming-service/_internal/useStreamOnHandler";
  import StreamingServiceLogo from "$lib/components/media/streaming-service/StreamingServiceLogo.svelte";
  import { StreamingServiceLogoIntlProvider } from "$lib/components/media/streaming-service/StreamingServiceLogoIntlProvider";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import MediaAction from "./MediaAction.svelte";

  const { streamOn }: { streamOn: StreamOn } = $props();

  const service = $derived(streamOn.preferred!);

  const handler = $derived(useStreamOnHandler(service));
  // TODO plex
</script>

<MediaAction text="Watch" label="TODO" {...handler}>
  <!-- <PlayIcon /> -->
  <StreamingServiceLogo
    source={service.source}
    i18n={StreamingServiceLogoIntlProvider}
  />
</MediaAction>
