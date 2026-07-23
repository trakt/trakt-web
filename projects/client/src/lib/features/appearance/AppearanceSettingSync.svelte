<script lang="ts">
  import { useAppearance } from "$lib/features/appearance/useAppearance.ts";

  const { reduceVisualNoise, reduceWidth, centerDrawers } = useAppearance();

  $effect(() => {
    const root = document.documentElement;
    root.toggleAttribute(
      "data-reduced-visual-noise",
      $reduceVisualNoise,
    );
    root.toggleAttribute("data-reduced-width", $reduceWidth);
    root.toggleAttribute("data-centered-drawers", $centerDrawers);

    return () => {
      root.removeAttribute("data-reduced-visual-noise");
      root.removeAttribute("data-reduced-width");
      root.removeAttribute("data-centered-drawers");
    };
  });
</script>
