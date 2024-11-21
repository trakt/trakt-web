<script>
  import Button from "$lib/components/buttons/Button.svelte";
</script>

<main>
  <h1>Buttons</h1>

  <section>
    <h2>Textured Buttons</h2>
    <Button
      label="This is the primary textured button"
      alignment="centered"
      style="textured"
    >
      Centered Textured
    </Button>

    <Button label="This is the primary textured button" style="textured">
      Primary Textured
    </Button>

    <Button
      label="This is the primary textured button in a disabled state"
      style="textured"
      disabled
    >
      Primary disabled
    </Button>

    <Button
      variant="vip"
      label="This is the VIP textured button"
      style="textured"
    >
      VIP Textured
    </Button>

    <Button
      variant="vip"
      label="This is the VIP textured button in a disabled state"
      style="textured"
      disabled
    >
      VIP disabled
    </Button>
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
