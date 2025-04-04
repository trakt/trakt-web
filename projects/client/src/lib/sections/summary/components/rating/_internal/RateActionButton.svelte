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

  const colorMap: Record<SimpleRating, "red" | "default"> = {
    [SimpleRating.Great]: "red",
    [SimpleRating.Good]: "default",
    [SimpleRating.Bad]: "default",
  };
</script>

<ActionButton
  disabled={isDisabled}
  label={toTranslatedValue("rating", rating)}
  onclick={() => onAddRating(rating)}
  color={colorMap[rating]}
  {style}
  {variant}
>
  <RateIcon {rating} />
</ActionButton>
