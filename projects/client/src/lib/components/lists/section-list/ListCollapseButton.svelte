<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import CollapseIcon from "./CollapseIcon.svelte";
  import type { ListCollapseButtonProps } from "./models/ListCollapseButtonProps";

  const { title, isCollapsed, onclick }: ListCollapseButtonProps = $props();

  const { isEnabled } = useFeatureFlag();
  const isEditModeEnabled = $derived(isEnabled(FeatureFlag.EditMode));
</script>

{#if !$isEditModeEnabled}
  <ActionButton
    {onclick}
    label={isCollapsed
      ? m.button_label_expand_list({ title })
      : m.button_label_collapse_list({ title })}
    style="ghost"
    color="default"
  >
    <CollapseIcon state={isCollapsed ? "collapsed" : "expanded"} />
  </ActionButton>
{/if}
