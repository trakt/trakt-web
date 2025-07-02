<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import LabSwitch from "$lib/components/badge/LabSwitch.svelte";
  import { useHiddenShows } from "./useHiddenShows";
  import { useUpNextExperiment } from "./useUpNextExperiment";

  const { toggle, enabled } = useUpNextExperiment();

  const { list: hidden, isLoading: isLoadingHidden } = useHiddenShows();

  const hasHidden = $derived(!$isLoadingHidden && $hidden.length > 0);
</script>

<LabSwitch
  tooltip={`${m.tooltip_text_up_next_nitro()} ${hasHidden ? m.tooltip_text_up_next_nitro_hidden() : ""}`}
  label={m.switch_label_up_next_nitro()}
  enabled={$enabled}
  onclick={toggle}
/>
