<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import { onMount } from "svelte";

  const demoDismissDurationMs = 300_000;

  let defaultOpen = $state(false);
  let titledOpen = $state(false);
  let contentOpen = $state(false);

  const showDefault = () => {
    defaultOpen = true;
    titledOpen = false;
    contentOpen = false;
  };

  const showTitled = () => {
    defaultOpen = false;
    titledOpen = true;
    contentOpen = false;
  };

  const showContent = () => {
    defaultOpen = false;
    titledOpen = false;
    contentOpen = true;
  };

  const closeDefault = () => {
    defaultOpen = false;
  };

  const closeTitled = () => {
    titledOpen = false;
  };

  const closeContent = () => {
    contentOpen = false;
  };

  onMount(showDefault);
</script>

<main>
  <div class="snackbar-display">
    <section>
      <div class="section-heading">
        <h2>Note saved</h2>
      </div>

      <div class="trigger-anchor">
        <Button color="purple" label="Show snackbar" onclick={showDefault}>
          Show snackbar
        </Button>
      </div>

      <Snackbar
        open={defaultOpen}
        onDismiss={closeDefault}
        message="Your note for Dune: Part Two was saved."
        dismissDurationMs={demoDismissDurationMs}
        action={{
          label: "View the saved note",
          text: "View",
          onAction: closeDefault,
        }}
      />
    </section>

    <section>
      <div class="section-heading">
        <h2>Progress updated</h2>
      </div>

      <div class="anchor-demo">
        <Button color="blue" label="Show titled snackbar" onclick={showTitled}>
          Show titled snackbar
        </Button>
      </div>

      <Snackbar
        open={titledOpen}
        onDismiss={closeTitled}
        title="Progress updated"
        message="Marked the episode as watched and updated your progress."
        dismissDurationMs={demoDismissDurationMs}
        action={{
          label: "Undo the progress update",
          text: "Undo",
          style: "outline",
          onAction: closeTitled,
        }}
      />
    </section>

    <section>
      <div class="section-heading">
        <h2>Custom content</h2>
      </div>

      <div class="anchor-demo">
        <Button
          color="blue"
          label="Show snackbar with custom content"
          onclick={showContent}
        >
          Show snackbar with custom content
        </Button>
      </div>

      <Snackbar
        open={contentOpen}
        onDismiss={closeContent}
        title="Exporting your data"
        dismissDurationMs={demoDismissDurationMs}
        action={{
          label: "Stop exporting",
          text: "Stop",
          onAction: closeContent,
        }}
      >
        <p>Exporting… (12/48 · 3)</p>
        <p class="small secondary">Fetching collection-shows…</p>
      </Snackbar>
    </section>
  </div>
</main>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  main {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    padding-block: var(--ni-32);
    align-items: center;
  }

  .snackbar-display {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--gap-xl);
    width: min(var(--ni-920), calc(100% - var(--ni-32)));

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;
    }
  }

  section {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: var(--gap-m);
    min-height: var(--ni-240);
  }

  .section-heading {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trigger-anchor {
    display: inline-flex;
  }
</style>
