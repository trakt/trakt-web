<script lang="ts">
  import SmartListNudgeBarContent from "./_internal/SmartListNudgeBarContent.svelte";
  import { useNudgeDismissal } from "./_internal/useNudgeDismissal.ts";
  import { useSmartListDraftsSummary } from "./_internal/useSmartListDraftsSummary.ts";

  const MIN_CONFIDENCE = 0.75;

  const { summary } = useSmartListDraftsSummary();
  const { isDismissed, dismiss } = useNudgeDismissal({ id: "bar" });

  const isVisible = $derived(
    !$isDismissed && ($summary?.bestConfidence ?? 0) >= MIN_CONFIDENCE,
  );
</script>

{#if isVisible && $summary}
  <SmartListNudgeBarContent summary={$summary} onDismiss={dismiss} />
{/if}
