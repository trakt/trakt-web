<script>
  import Button from "$lib/components/buttons/Button.svelte";
</script>

<main>
  <h1>Buttons</h1>

  <div class="button-display">
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

    <section>
      <h2>Flat Buttons</h2>
      <Button label="This is the primary flat button" alignment="centered">
        Centered Flat
      </Button>

      <Button label="This is the primary flat button">Primary Flat</Button>

      <Button
        label="This is the primary flat button in a disabled state"
        disabled
      >
        Primary disabled
      </Button>

      <Button variant="vip" label="This is the VIP textured button">
        VIP Flat
      </Button>

      <Button
        variant="vip"
        label="This is the VIP flat button in a disabled state"
        disabled
      >
        VIP disabled
      </Button>
    </section>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
    align-items: center;

    section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }
  }

  .button-display {
    display: flex;
    justify-content: space-between;

    width: 75%;
  }
</style>
