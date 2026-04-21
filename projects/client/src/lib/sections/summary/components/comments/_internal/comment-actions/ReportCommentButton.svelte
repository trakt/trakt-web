<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import FlagIcon from "$lib/components/icons/FlagIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { ReportableType } from "$lib/features/report/models/ReportableType";
  import { useReportDialog } from "$lib/features/report/useReportDialog";
  import type { MediaComment } from "$lib/requests/models/MediaComment";

  type ReportCommentButtonProps = {
    comment: MediaComment;
  };

  const { comment }: ReportCommentButtonProps = $props();

  const report = useReportDialog();

  const handleReport = () => {
    report.open({ type: ReportableType.Comment, id: comment.id });
  };
</script>

<DropdownItem
  onclick={handleReport}
  label={m.button_label_report_comment()}
  color="default"
  style="flat"
  variant="secondary"
>
  {m.button_text_report_comment()}
  {#snippet icon()}
    <FlagIcon />
  {/snippet}
</DropdownItem>
