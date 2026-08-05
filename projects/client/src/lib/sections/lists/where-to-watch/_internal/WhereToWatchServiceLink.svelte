<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import type { StreamingServiceOption } from "$lib/requests/models/StreamingServiceOptions";
  import type { LibraryOption } from "../models/LibraryOption";

  type WhereToWatchServiceLinkProps = {
    service: StreamingServiceOption | LibraryOption;
  } & ChildrenProps;

  const { service, children }: WhereToWatchServiceLinkProps = $props();

  const { track } = useTrack(AnalyticsEvent.StreamOn);
</script>

<Link
  href={service.link}
  target="_blank"
  onclick={() => track({ source: service.source })}
>
  {@render children()}
</Link>
