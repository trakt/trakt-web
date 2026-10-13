<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import FlagIcon from "$lib/components/icons/FlagIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ReportParams } from "./models/ReportParams.ts";
  import { useReportDialog } from "./useReportDialog.ts";

  type ReportButtonProps = {
    params: ReportParams;
    label: string;
  };

  const { params, label }: ReportButtonProps = $props();

  const report = useReportDialog();

  const handleReport = () => {
    report.open(params);
  };
</script>

<DropdownItem
  onclick={handleReport}
  {label}
>
  {m.button_text_report()}
  {#snippet icon()}
    <FlagIcon />
  {/snippet}
</DropdownItem>
