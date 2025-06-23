<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { useLoginTarget } from "./useLoginTarget";

  const { target } = useLoginTarget();
</script>

<join-trakt-button>
  <Button
    label={m.button_label_join_trakt()}
    style="flat"
    size="small"
    color="purple"
    variant="primary"
    navigationType={DpadNavigationType.Item}
    {...$target}
  >
    {m.button_text_join_trakt()}
  </Button>
</join-trakt-button>
