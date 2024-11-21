<script>
  import TexturedButton from "$lib/components/buttons/textured/TexturedButton.svelte";
</script>

<main>
  <h1>Buttons</h1>

  <section>
    <h2>Textured Buttons</h2>
    <TexturedButton label="This is the primary textured button">
      Primary Textured
    </TexturedButton>

    <TexturedButton
      label="This is the primary textured button in a disabled state"
      disabled
    >
      Primary disabled
    </TexturedButton>

    <TexturedButton variant="vip" label="This is the VIP textured button">
      VIP Textured
    </TexturedButton>

    <TexturedButton
      variant="vip"
      label="This is the VIP textured button in a disabled state"
      disabled
    >
      VIP disabled
    </TexturedButton>
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
