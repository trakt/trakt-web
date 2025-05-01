<script lang="ts">
  import { page } from "$app/state";
  import Button from "$lib/components/buttons/Button.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import GlobalParameterEscaper from "$lib/features/parameters/GlobalParameterEscaper.svelte";

  const { hasActiveFilter } = useFilter();
</script>

<GlobalParameterEscaper enabled>
  <Button
    label={m.filter_reset_all_label()}
    size="small"
    color="red"
    style="flat"
    variant="secondary"
    disabled={!$hasActiveFilter || undefined}
    href={page.url.pathname}
  >
    {m.filter_reset_all()}
  </Button>
</GlobalParameterEscaper>
