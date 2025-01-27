<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import RateIcon from "$lib/components/icons/RateIcon.svelte";
  import { SimpleRating } from "$lib/models/SimpleRating";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";

  const {
    rating,
    isCurrentRating,
    isDisabled,
    onAddRating,
  }: {
    rating: SimpleRating;
    isCurrentRating: boolean;
    isDisabled: boolean;
    onAddRating: (rating: SimpleRating) => void;
  } = $props();

  const style = $derived(isCurrentRating ? "flat" : "ghost");
  const variant = $derived(isCurrentRating ? "primary" : "secondary");

  const colorMap: Record<
    SimpleRating,
    { backgroundColor: string; foregroundColor: string }
  > = {
    [SimpleRating.Great]: {
      backgroundColor: "var(--red-900)",
      foregroundColor: "var(--red-500)",
    },
    [SimpleRating.Good]: {
      backgroundColor: "var(--shade-10)",
      foregroundColor: "var(--shade-500)",
    },
    [SimpleRating.Bad]: {
      backgroundColor: "var(--shade-10)",
      foregroundColor: "var(--shade-500)",
    },
  };
</script>

<ActionButton
  disabled={isDisabled}
  label={toTranslatedValue("rating", rating)}
  onclick={() => onAddRating(rating)}
  color="default"
  {style}
  {variant}
  --color-background-default={colorMap[rating].backgroundColor}
  --color-foreground-default={colorMap[rating].foregroundColor}
>
  <RateIcon {rating} />
</ActionButton>
