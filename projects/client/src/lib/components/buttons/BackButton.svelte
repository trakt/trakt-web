<script lang="ts">
  import ArrowLeftIcon from "$lib/components/icons/ArrowLeftIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { useNavigationHistory } from "$lib/features/navigation-history/useNavigationHistory.ts";
  import ActionButton from "./ActionButton.svelte";

  const { goBack } = useNavigationHistory();
</script>

<ActionButton
  label={m.button_label_back()}
  style="ghost"
  onclick={goBack}
>
  <ArrowLeftIcon />
</ActionButton>
