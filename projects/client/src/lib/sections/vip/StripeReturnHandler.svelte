<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import { useVip } from "./_internal/useVip";

  // FIXME: should not be a Svelte component, but a route handler
  const { confirmCheckout } = useVip();

  // Stripe appends ?session_id=... when returning from a checkout or payment
  // update. Reconcile it in-app (bridge VIP + finalize migration) so the flow
  // never routes through OG, then strip the param from the URL.
  onMount(() => {
    const sessionId = page.url.searchParams.get("session_id");
    if (!sessionId) {
      return;
    }

    const cleanUrl = () => {
      const url = new URL(page.url);
      url.searchParams.delete("session_id");
      goto(url, { replaceState: true, keepFocus: true, noScroll: true });
    };

    confirmCheckout(sessionId).finally(cleanUrl);
  });
</script>
