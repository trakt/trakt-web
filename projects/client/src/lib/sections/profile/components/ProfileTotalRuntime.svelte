<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";

  type ProfileWatchTimeProps = {
    items: { runtime: number }[];
  };

  const { items }: ProfileWatchTimeProps = $props();

  const totalRuntime = items.reduce((acc, item) => acc + item.runtime, 0);
</script>

<h6>
  {toHumanDuration(
    {
      minutes: totalRuntime,
      unitDisplay: "long",
      separator: ", ",
    },
    languageTag(),
  )}
</h6>
