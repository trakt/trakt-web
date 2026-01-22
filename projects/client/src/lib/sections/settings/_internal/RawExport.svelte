<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { slide } from "svelte/transition";
  import { runRawExport } from "../export/runRawExport.ts";
  import SettingsBlock from "./SettingsBlock.svelte";
  import SettingsRow from "./SettingsRow.svelte";

  const { user } = useUser();

  let isExporting = $state(false);
  let statusText = $state("");
  let progress = $state("");

  async function startExport() {
    if (!$user) return;

    isExporting = true;

    await runRawExport({
      user: { slug: $user.slug, isVip: $user.isVip },
      onStatus: (status) => {
        switch (status.type) {
          case "complete":
            statusText = m.text_export_status_complete();
            break;
          case "zip":
            statusText = m.text_export_status_zipping();
            break;
          case "fetch":
            statusText = m.text_export_status_fetching({ item: status.item });
            break;
        }
      },
      onProgress: (msg) => (progress = msg),
      onComplete: () => {
        setTimeout(() => {
          isExporting = false;
          statusText = "";
          progress = "";
        }, time.seconds(3));
      },
      onError: () => {
        statusText = m.text_export_status_fail();
        isExporting = false;
      },
    });
  }
</script>

{#snippet exportLabel(message: string)}
  <p class="secondary" transition:slide={{ duration: 150, axis: "y" }}>
    {message}
  </p>
{/snippet}

<SettingsBlock title={m.header_export()} description={m.description_export()}>
  <SettingsRow title={m.text_raw_export()}>
    <div class="trakt-raw-export">
      <Button
        label={m.button_label_raw_export()}
        disabled={isExporting}
        onclick={startExport}
        color="default"
        size="small"
      >
        {m.button_text_raw_export()}
      </Button>
      <div>
        {#if isExporting}
          {@render exportLabel(m.text_exporting({ progress }))}
        {/if}
        {#if statusText}
          {@render exportLabel(statusText)}
        {/if}
      </div>
    </div>
  </SettingsRow>
</SettingsBlock>

<style>
  .trakt-raw-export {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
