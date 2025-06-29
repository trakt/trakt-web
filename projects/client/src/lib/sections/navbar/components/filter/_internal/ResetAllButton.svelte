<script lang="ts">
  import { page } from "$app/state";
  import Button from "$lib/components/buttons/Button.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import GlobalParameterEscaper from "$lib/features/parameters/GlobalParameterEscaper.svelte";

  const { hasActiveFilter } = useFilter();
</script>

<GlobalParameterEscaper enabled>
  <Button
    label={m.button_label_reset_all_filters()}
    size="small"
    color="red"
    style="flat"
    variant="secondary"
    disabled={!$hasActiveFilter || undefined}
    href={page.url.pathname}
    navigationType={DpadNavigationType.Item}
  >
    {m.button_text_reset_all_filters()}
  </Button>
</GlobalParameterEscaper>
