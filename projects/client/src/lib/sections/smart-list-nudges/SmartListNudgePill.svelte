<script lang="ts">
  import { page } from "$app/state";
  import SmartListNudgePillContent from "./_internal/SmartListNudgePillContent.svelte";
  import { isPillSuppressedPath } from "./_internal/isPillSuppressedPath.ts";
  import { useNudgeDismissal } from "./_internal/useNudgeDismissal.ts";
  import { useSmartListDraftsSummary } from "./_internal/useSmartListDraftsSummary.ts";

  const MIN_CONFIDENCE = 0.9;
  const MAX_DISMISSALS = 2;

  const { summary } = useSmartListDraftsSummary();
  const { isDismissed, dismiss } = useNudgeDismissal({
    id: "pill",
    maxDismissals: MAX_DISMISSALS,
  });

  const isVisible = $derived(
    !$isDismissed &&
      !isPillSuppressedPath(page.url.pathname) &&
      ($summary?.bestConfidence ?? 0) >= MIN_CONFIDENCE,
  );
</script>

{#if isVisible && $summary}
  <SmartListNudgePillContent
    count={$summary.convertibleCount}
    onDismiss={dismiss}
  />
{/if}
