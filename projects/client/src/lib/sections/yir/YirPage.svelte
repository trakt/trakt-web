<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { YirYear } from "$lib/requests/models/YirYear";
  import { of } from "rxjs";
  import ReviewPageShell from "./_internal/ReviewPageShell.svelte";
  import YirHeader from "./_internal/YirHeader.svelte";
  import { useYirDetail } from "./_internal/useYirDetail";
  import YirAllTime from "./all-time/YirAllTime.svelte";
  import { getYirTemplate } from "./getYirTemplate";

  const { slug, year }: { slug: string; year: YirYear } = $props();

  const { user } = useUser();
  const { isMe } = $derived(useIsMe(slug));

  // The only case that reliably fails is your own page while non-VIP,
  // so skip the query there and show the identity + upsell.
  // Other profiles may be viewable, so let the query decide.
  const { detail, isLoading } = $derived(
    !$isMe || $user?.isVip
      ? useYirDetail({ slug, year })
      : { detail: of(null), isLoading: of(false) },
  );
</script>

<!-- The 2024 template's hero is theme-aware (not a dark poster), so its header
     text tracks the theme; every other year uses the white-on-poster default. -->
<ReviewPageShell
  id="year-in-review"
  headerForeground={year === 2024 ? "theme" : "poster"}
>
  <YirHeader {slug} {year} />
  <!-- Always mount the template so its scaffold (header text, hero shell)
       paints immediately; detail-dependent sections inside the template
       gate on `detail` and fill in once the query lands. -->
  {#if year === "all"}
    <YirAllTime detail={$detail ?? null} isLoading={$isLoading} {slug} />
  {:else}
    {@const Template = getYirTemplate(year)}
    <Template detail={$detail ?? null} isLoading={$isLoading} {slug} {year} />
  {/if}
</ReviewPageShell>
