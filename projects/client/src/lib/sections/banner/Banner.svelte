<script lang="ts">
  import { isFirstWeekOfMonth } from "$lib/utils/date/isFirstWeekOfMonth";
  import BannerContainer from "./_internal/BannerContainer.svelte";
  import MonthInReview from "./month-in-review/MonthInReview.svelte";

  const now = new Date();
  const isFirstWeek = isFirstWeekOfMonth(now);
</script>

{#if isFirstWeek}
  <BannerContainer>
    <MonthInReview />
  </BannerContainer>
{/if}
