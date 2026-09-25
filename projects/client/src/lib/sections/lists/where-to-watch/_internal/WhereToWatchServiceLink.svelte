<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { StreamingServiceOption } from "$lib/requests/models/StreamingServiceOptions";
  import type { LibraryOption } from "../models/LibraryOption";
  import type { YouTubeSpecialOption } from "../models/YouTubeSpecialOption.ts";

  type WhereToWatchServiceLinkProps = {
    service: StreamingServiceOption | LibraryOption | YouTubeSpecialOption;
  } & ChildrenProps;

  const { service, children }: WhereToWatchServiceLinkProps = $props();

  const { track } = useTrack(AnalyticsEvent.StreamOn);

  function toLabel(
    service: WhereToWatchServiceLinkProps["service"],
  ): string | undefined {
    if (service.type !== "youtube-special") return undefined;

    return service.isOfficial
      ? m.button_label_watch_official_upload_on_youtube()
      : m.button_label_watch_fan_upload_on_youtube();
  }

  const label = $derived(toLabel(service));
</script>

<Link
  href={service.link}
  target="_blank"
  {label}
  onclick={() => track({ source: service.source })}
>
  {@render children()}
</Link>
