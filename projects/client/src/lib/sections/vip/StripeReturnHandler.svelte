<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { onMount } from "svelte";
  import { parseVipParams } from "./_internal/utils/parseVipParams";
  import { toVipFailureCode } from "./_internal/utils/toVipFailureCode";
  import { toYirEmailReturnPath } from "./_internal/utils/toYirEmailReturnPath";
  import { useVip } from "./_internal/useVip";

  // FIXME: should not be a Svelte component, but a route handler
  const { confirmCheckout } = useVip();
  const { track: trackConfirmed } = useTrack(AnalyticsEvent.VipConfirmed);
  const { track: trackConfirmFailed } = useTrack(
    AnalyticsEvent.VipConfirmFailed,
  );
  const { track: trackCanceled } = useTrack(AnalyticsEvent.VipCheckoutCanceled);

  // Stripe appends ?session_id=... when returning from a checkout or payment
  // update. Reconcile it in-app (bridge VIP + finalize migration) so the flow
  // never routes through OG, then strip the param from the URL.
  onMount(() => {
    const sessionId = page.url.searchParams.get("session_id");
    const { plan, source, flow, checkout } = parseVipParams(page.url);
    // Payment method updates also return with a session_id but carry no plan,
    // so only checkout returns count as funnel steps.
    const tracking = plan ? { plan, source, flow } : null;

    if (!sessionId && checkout !== "canceled") {
      return;
    }

    const cleanUrl = () => {
      const url = new URL(page.url);
      url.searchParams.delete("session_id");
      url.searchParams.delete("checkout");
      url.searchParams.delete("plan");
      goto(url, { replaceState: true, keepFocus: true, noScroll: true });
    };

    if (!sessionId) {
      if (tracking) trackCanceled(tracking);
      cleanUrl();
      return;
    }

    const returnTo = toYirEmailReturnPath(page.url);

    confirmCheckout(sessionId).then(
      () => {
        if (tracking) trackConfirmed(tracking);

        if (!returnTo) return cleanUrl();
        goto(returnTo, { replaceState: true });
      },
      (error) => {
        if (tracking) {
          trackConfirmFailed({ ...tracking, error: toVipFailureCode(error) });
        }

        cleanUrl();
        throw error;
      },
    );
  });
</script>
