<script lang="ts">
  import { page } from "$app/state";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { filter, take } from "rxjs";
  import { onMount } from "svelte";
  import Subscriptions from "./_internal/Subscriptions.svelte";
  import UpsellFooter from "./_internal/UpsellFooter.svelte";
  import VipContent from "./_internal/VipContent.svelte";
  import VipFeatures from "./_internal/VipFeatures.svelte";
  import { parseVipParams } from "./_internal/utils/parseVipParams";

  const { track } = useTrack(AnalyticsEvent.VipView);
  const { user } = useUser();

  onMount(() => {
    const resolvedUser = user
      .pipe(filter(Boolean), take(1))
      .subscribe(({ isVip }) => {
        const { source, flow, plan } = parseVipParams(page.url);
        if (plan) return;
        if (isVip && flow === "new") return;

        track({ source, flow });
      });

    return () => resolvedUser.unsubscribe();
  });
</script>

<VipContent>
  <Subscriptions />
  <VipFeatures />
  <UpsellFooter />
</VipContent>
