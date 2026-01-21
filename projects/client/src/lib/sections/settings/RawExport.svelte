<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { runRawExport } from "./export/runRawExport.ts";

  const { user } = useUser();

  let exporting = $state(false);
  let status = $state("");
  let progress = $state("");

  async function startExport() {
    if (!$user || !$user.slug) return;

    exporting = true;

    await runRawExport({
      user: { slug: $user.slug, isVip: $user.isVip },
      onStatus: (msg) => (status = msg),
      onProgress: (msg) => (progress = msg),
      onComplete: () => {
        setTimeout(() => {
          exporting = false;
          status = "";
          progress = "";
        }, 3000);
      },
      onError: () => {
        status = "Export failed. Check console.";
        exporting = false;
      },
    });
  }
</script>

<div class="raw-export">
  <div class="description">
    <h3>Raw Export</h3>
    <p>
      Export all your user data as a single ZIP file. This process may take a
      while.
    </p>
  </div>

  <div class="actions">
    <Button
      label={exporting ? `Exporting... ${progress}` : "Export Data"}
      disabled={exporting || !$user}
      onclick={startExport}
    >
      {exporting ? `Exporting... ${progress}` : "Export Data"}
    </Button>
    {#if status}
      <p class="status">{status}</p>
    {/if}
  </div>
</div>

<style lang="scss">
  .raw-export {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    padding: var(--ni-16);
    background: var(--color-surface-lvl-2);
    border-radius: var(--border-radius-l);
  }

  .description {
    h3 {
      margin-bottom: var(--ni-8);
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
  }

  .status {
    color: var(--color-text-subtle);
    font-size: var(--font-size-s);
  }
</style>
