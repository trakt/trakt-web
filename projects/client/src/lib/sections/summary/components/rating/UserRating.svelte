<script lang="ts">
  import RateIcon from "$lib/components/icons/RateIcon.svelte";
  import { SimpleRating } from "$lib/models/SimpleRating";

  const {
    rating,
    isCurrentRating,
  }: { rating: SimpleRating; isCurrentRating: boolean } = $props();

  const iconColor = $derived(
    rating === SimpleRating.Great ? "var(--red-500)" : "var(--shade-10)",
  );
  const iconFillColor = $derived(isCurrentRating ? iconColor : "transparent");
</script>

<RateIcon {rating} --icon-color={iconColor} --icon-fill-color={iconFillColor} />
