<script lang="ts">
  import { BehaviorSubject } from "rxjs";
  import Button from "../Button.svelte";
  import type { MoreButtonIntl } from "./MoreButtonIntl";

  type MediaCollapsableValuesProps = {
    i18n: MoreButtonIntl;
    count: number | Nil;
    label: string;
    onExpand: () => void;
    onCollapse: () => void;
  };

  const {
    i18n,
    count,
    label,
    onCollapse,
    onExpand,
  }: MediaCollapsableValuesProps = $props();
  const expanded = new BehaviorSubject(false);
</script>

<Button
  onclick={() => {
    const state = expanded.value;
    if (state) {
      onCollapse();
    } else {
      onExpand();
    }
    expanded.next(!state);
  }}
  {label}
  style="ghost"
  size="tag"
  color="purple"
>
  {$expanded ? "-" : "+"}
  {i18n.more(count)}
</Button>
