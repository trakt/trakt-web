<script lang="ts">
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { onMount } from "svelte";
  import { applyTopicPaint } from "./applyTopicPaint.ts";
  import { loadTopicPaint } from "./loadTopicPaint.ts";
  import { pickWatchlistTopic } from "./pickWatchlistTopic.ts";
  import { readTopicCache } from "./readTopicCache.ts";
  import { topicRegistry } from "./topicRegistry.ts";
  import { writeTopicCache } from "./writeTopicCache.ts";

  const TOPIC_ATTRIBUTE = "data-topic";

  const { watchlist } = useUser();
  const { track } = useTrack(AnalyticsEvent.TopicApply);

  let cached = $state<ReturnType<typeof readTopicCache>>(null);

  const picked = $derived(pickWatchlistTopic($watchlist));
  const topic = $derived(picked === undefined ? cached : picked);

  onMount(() => {
    cached = readTopicCache();
  });

  $effect(() => {
    if (picked === undefined) return;
    writeTopicCache(picked);
    if (picked === null) applyTopicPaint(null);
  });

  $effect(() => {
    if (!topic) return;

    let isCurrent = true;
    loadTopicPaint(topic).then((css) => isCurrent && applyTopicPaint(css));
    return () => {
      isCurrent = false;
    };
  });

  $effect(() => {
    if (!picked) return;
    track({ topic: picked });
  });

  $effect(() => {
    if (!topic) {
      document.documentElement.removeAttribute(TOPIC_ATTRIBUTE);
      return;
    }

    document.documentElement.setAttribute(TOPIC_ATTRIBUTE, topic);
    return () => document.documentElement.removeAttribute(TOPIC_ATTRIBUTE);
  });
</script>

{#if topic}
  {#await topicRegistry[topic]() then { default: Topic }}
    <Topic />
  {/await}
{/if}
