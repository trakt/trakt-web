<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ReportForm from "./_internal/ReportForm.svelte";
  import type { ReportParams } from "./models/ReportParams";

  type ReportDialogProps = {
    params: ReportParams;
    onClose: () => void;
  };

  const { params, onClose }: ReportDialogProps = $props();
</script>

<Drawer {onClose} size="auto" title={m.dialog_title_report()}>
  <ReportForm {params} {onClose} />
</Drawer>
