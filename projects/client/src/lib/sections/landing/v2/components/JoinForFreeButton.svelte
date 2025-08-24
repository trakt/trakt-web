<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { useLoginTarget } from "$lib/sections/navbar/components/useLoginTarget";

  const { target } = useLoginTarget();
</script>

<Button
  color="purple"
  label={m.button_label_join_trakt()}
  style="flat"
  navigationType={DpadNavigationType.Item}
  {...$target}
>
  {m.button_text_join_trakt_for_free()}
</Button>
