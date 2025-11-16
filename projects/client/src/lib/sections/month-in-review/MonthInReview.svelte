<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { getPreviousMonth } from "$lib/utils/date/getPreviousMonth";
  import { isFirstWeekOfMonth } from "../../utils/date/isFirstWeekOfMonth";
  import MonthInReviewLink from "./_internal/MonthInReviewLink.svelte";

  const { user } = useUser();

  const now = new Date();
  const previousMonth = getPreviousMonth(now);
  const isFirstWeek = isFirstWeekOfMonth(now);
</script>

<RenderFor audience="vip">
  {#if isFirstWeek}
    <div class="trakt-month-in-review">
      <MonthInReviewLink slug={$user.slug} date={previousMonth} />
    </div>
  {/if}
</RenderFor>

<style>
  .trakt-month-in-review {
    display: flex;
    justify-content: flex-end;

    padding: 0 var(--layout-distance-side);
  }
</style>
