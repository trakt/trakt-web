<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import PrivateReview from "$lib/sections/review/PrivateReview.svelte";
  import ReviewPageShell from "$lib/sections/yir/_internal/ReviewPageShell.svelte";
  import YirHeader from "$lib/sections/yir/_internal/YirHeader.svelte";
  import YirPersonaTheme from "../persona/YirPersonaTheme.svelte";
  import type { FreeYearReview } from "./FreeYearReview";
  import YirFreeReview from "./YirFreeReview.svelte";

  const {
    slug,
    year,
    review,
    privateName,
  }: {
    slug: string;
    year: number;
    review: FreeYearReview | null;
    privateName?: string;
  } = $props();

  const { user } = useUser();
</script>

<YirPersonaTheme persona={null}>
  <ReviewPageShell id="year-in-review" headerForeground="theme">
    <YirHeader {slug} {year} isShareable={false} />
    {#if privateName === undefined}
      <YirFreeReview {review} {year} />
    {:else}
      <div class="trakt-yir-free-private">
        <PrivateReview
          name={privateName}
          {year}
          periodName={String(year)}
          canSeeOwn={Boolean($user?.slug)}
        />
      </div>
    {/if}
  </ReviewPageShell>
</YirPersonaTheme>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-free-private {
    box-sizing: border-box;
    width: 100%;
    max-width: var(--ni-920);
    margin-inline: auto;
    padding: calc(var(--ni-104) + env(safe-area-inset-top, 0px)) var(--ni-24)
      var(--ni-120);
  }
</style>
