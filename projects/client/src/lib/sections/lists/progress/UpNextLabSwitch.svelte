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
  tooltip={`${m.lab_up_next_nitro_message()} ${hasHidden ? m.lab_up_next_nitro_hidden_message() : ""}`}
  label={m.lab_up_next_nitro_label()}
  enabled={$enabled}
  onclick={toggle}
/>
