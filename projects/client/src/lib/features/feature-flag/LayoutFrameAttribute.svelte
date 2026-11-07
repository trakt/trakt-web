<script lang="ts">
  import { FeatureFlag } from "./models/FeatureFlag";
  import { useFeatureFlag } from "./useFeatureFlag";

  const { isEnabled } = useFeatureFlag();
  const isFrameEnabled = isEnabled(FeatureFlag.CenterStageFrame);

  $effect(() => {
    const root = globalThis.document.documentElement;
    root.toggleAttribute("data-layout-frame", $isFrameEnabled);

    return () => root.removeAttribute("data-layout-frame");
  });
</script>
