<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { AnalyticsProps } from "./AnalyticsProps";
  import AnonymousAnalytics from "./AnonymousAnalytics.svelte";
  import UserAnalytics from "./UserAnalytics.svelte";

  const { onload }: AnalyticsProps = $props();
</script>

<RenderFor audience="authenticated">
  <UserAnalytics {onload} />
</RenderFor>

<RenderFor audience="public">
  <AnonymousAnalytics {onload} />
</RenderFor>
