<script lang="ts">
  import { getMonthKey } from "$lib/utils/date/getMonthKey";
  import { getPreviousMonth } from "$lib/utils/date/getPreviousMonth";
  import { isFirstWeekOfMonth } from "$lib/utils/date/isFirstWeekOfMonth";
  import BannerContainer from "./_internal/BannerContainer.svelte";
  import { useBannerDismissal } from "./_internal/useBannerDismissal";
  import { MIR_BANNER_ID } from "./month-in-review/constants";
  import MonthInReview from "./month-in-review/MonthInReview.svelte";

  const now = new Date();

  const { dismiss, isDismissed } = $derived(
    useBannerDismissal(MIR_BANNER_ID, getMonthKey(now)),
  );

  const hasMir = $derived(isFirstWeekOfMonth(now) && !$isDismissed);
</script>

{#if hasMir}
  <BannerContainer>
    <MonthInReview onDismiss={dismiss} month={getPreviousMonth(now)} />
  </BannerContainer>
{/if}
