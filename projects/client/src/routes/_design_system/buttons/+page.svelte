<script>
  import Button from "$lib/components/buttons/Button.svelte";
  import VipIcon from "$lib/components/icons/VipIcon.svelte";
  import WatchNowIcon from "$lib/components/icons/WatchNowIcon.svelte";
</script>

<main>
  <h1>Buttons</h1>

  <div class="button-display">
    <section>
      <h2>Textured</h2>
      <Button label="This is the primary textured button" style="textured">
        Icon Textured
        {#snippet icon()}
          <WatchNowIcon />
        {/snippet}
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
        variant="secondary"
        label="This is the secondary textured button"
        style="textured"
      >
        Secondary Textured
      </Button>

      <Button
        variant="secondary"
        label="This is the secondary textured button in a disabled state"
        style="textured"
        disabled
      >
        Secondary disabled
      </Button>

      <Button
        variant="vip"
        label="This is the VIP textured button"
        style="textured"
      >
        VIP Textured
        {#snippet icon()}
          <VipIcon />
        {/snippet}
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
      <h2>Flat</h2>
      <Button label="This is the primary flat button"
        >Icon Flat

        {#snippet icon()}
          <WatchNowIcon />
        {/snippet}
      </Button>

      <Button label="This is the primary flat button">Primary Flat</Button>

      <Button
        label="This is the primary flat button in a disabled state"
        disabled
      >
        Primary disabled
      </Button>

      <Button variant="secondary" label="This is the secondary flat button">
        Secondary Flat
      </Button>

      <Button
        variant="secondary"
        label="This is the secondary flat button in a disabled state"
        disabled
      >
        Secondary disabled
      </Button>

      <Button variant="vip" label="This is the VIP flat button">
        VIP Flat
        {#snippet icon()}
          <VipIcon />
        {/snippet}
      </Button>

      <Button
        variant="vip"
        label="This is the VIP flat button in a disabled state"
        disabled
      >
        VIP disabled
      </Button>
    </section>

    <section>
      <h2>Ghost</h2>
      <Button label="This is the primary ghost button" style="ghost">
        Ghost icon

        {#snippet icon()}
          <WatchNowIcon />
        {/snippet}
      </Button>

      <Button label="This is the primary ghost button" style="ghost">
        Ghost primary
      </Button>

      <Button
        label="This is the primary ghost button in a disabled state"
        style="ghost"
        disabled
      >
        Ghost disabled
      </Button>

      <Button
        variant="secondary"
        label="This is the secondary ghost button"
        style="ghost"
      >
        Ghost secondary
      </Button>

      <Button
        variant="secondary"
        label="This is the secondary ghost button in a disabled state"
        style="ghost"
        disabled
      >
        Secondary disabled
      </Button>

      <Button variant="vip" label="This is the VIP ghost button" style="ghost">
        Ghost VIP
        {#snippet icon()}
          <VipIcon />
        {/snippet}
      </Button>

      <Button
        variant="vip"
        label="This is the VIP ghost button in a disabled state"
        style="ghost"
        disabled
      >
        VIP disabled
      </Button>

      <Button
        variant="custom"
        label="This is the custom ghost button"
        style="ghost"
        --color-background-button="green"
      >
        Ghost custom
      </Button>

      <Button
        variant="custom"
        label="This is the custom ghost button in a disabled state"
        style="ghost"
        disabled
      >
        Custom disabled
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

    @media (max-width: 768px) {
      .button-display {
        flex-direction: column;
        align-items: center;
        gap: 2rem;
      }
    }

    section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: start;
    }
  }

  .button-display {
    display: flex;
    justify-content: space-between;

    width: 75%;
  }
</style>
