<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { of } from "rxjs";
  import Yir2024 from "./2024/Yir2024.svelte";
  import MirHeader from "./_internal/MirHeader.svelte";
  import ReviewPageShell from "./_internal/ReviewPageShell.svelte";
  import { useMirDetail } from "./_internal/useMirDetail";

  const {
    slug,
    year,
    month,
  }: {
    slug: string;
    year: number;
    /** 1-12. */
    month: number;
  } = $props();

  const { user } = useUser();
  const { isMe } = $derived(useIsMe(slug));

  // The only case that reliably fails is your own page while non-VIP,
  // so skip the query there and show the identity + upsell.
  // Other profiles may be viewable, so let the query decide.
  const { detail, isLoading } = $derived(
    !$isMe || $user?.isVip
      ? useMirDetail({ slug, year, month })
      : { detail: of(null), isLoading: of(false) },
  );
</script>

<!-- MIR renders the theme-aware 2024 template, so the header tracks the theme;
     `spacious` adds bottom breathing room below the final section. -->
<ReviewPageShell id="month-in-review" headerForeground="theme" spacious>
  <MirHeader {slug} {year} {month} />
  <!-- Month in Review reuses the 2024 template in MIR mode: the same scaffold
       paints immediately and detail-dependent sections fill in once the query
       lands. -->
  <Yir2024
    detail={$detail ?? null}
    isLoading={$isLoading}
    {slug}
    {year}
    {month}
    mode="mir"
  />
</ReviewPageShell>
