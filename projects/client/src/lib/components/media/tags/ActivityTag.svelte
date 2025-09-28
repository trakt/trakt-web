<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { TagIntl } from "./TagIntl";

  const {
    activityDate,
    i18n,
  }: {
    activityDate: Date;
    i18n: TagIntl;
  } = $props();
</script>

<StemTag>
  <p class="meta-info capitalize no-wrap">
    {i18n.toActivityDate(activityDate)}
  </p>
</StemTag>
