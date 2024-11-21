<script>
  import PrimaryTexturedButton from "$lib/components/buttons/textured/PrimaryTexturedButton.svelte";
  import TexturedButton from "$lib/components/buttons/textured/TexturedButton.svelte";
</script>

<main>
  <h1>Buttons</h1>

  <section>
    <h2>Textured Buttons</h2>
    <TexturedButton
      label="This is the abstract textured button"
      --color-background-button="peru"
      --color-foreground-button="#efefef"
    >
      Abstract Textured
    </TexturedButton>
    <TexturedButton
      label="This is the abstract textured button in a disabled state"
      --color-background-button="peru"
      --color-foreground-button="#efefef"
      disabled
    >
      Abstract Disabled
    </TexturedButton>

    <PrimaryTexturedButton label="This is the primary textured button"
      >Primary Textured</PrimaryTexturedButton
    >

    <PrimaryTexturedButton
      label="This is the primary textured button in a disabled state"
      disabled>Primary disabled</PrimaryTexturedButton
    >
  </section>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;

    section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
