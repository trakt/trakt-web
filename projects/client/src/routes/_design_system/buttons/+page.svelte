<script>
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import VipIcon from "$lib/components/icons/VipIcon.svelte";
  import WatchNowIcon from "$lib/components/icons/WatchNowIcon.svelte";
</script>

<main>
  <h1>Buttons</h1>

  <div class="button-display">
    <section>
      <h2>Textured</h2>
      <Button label="This is the primary textured button" style="textured">
        Textured Icon
        {#snippet icon()}
          <WatchNowIcon />
        {/snippet}
      </Button>

      <Button label="This is the primary textured button" style="textured">
        Textured primary
      </Button>

      <Button
        label="This is the primary textured button in a disabled state"
        style="textured"
        disabled
      >
        Textured disabled
      </Button>

      <Button
        variant="secondary"
        label="This is the secondary textured button"
        style="textured"
      >
        Textured secondary
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
        Textured VIP
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
        {#snippet icon()}
          <VipIcon />
        {/snippet}
      </Button>

      <Button
        variant="custom"
        label="This is the custom textured button"
        style="textured"
        --color-background-button="darkorange"
      >
        Textured custom
      </Button>

      <Button
        variant="custom"
        label="This is the custom textured button in a disabled state"
        style="textured"
        disabled
      >
        Custom disabled
      </Button>
    </section>

    <section>
      <h2>Flat</h2>
      <Button label="This is the primary flat button">
        Flat Icon
        {#snippet icon()}
          <WatchNowIcon />
        {/snippet}
      </Button>

      <Button label="This is the primary flat button">Flat primary</Button>

      <Button
        label="This is the primary flat button in a disabled state"
        disabled
      >
        Flat disabled
      </Button>

      <Button variant="secondary" label="This is the secondary flat button">
        Flat secondary
      </Button>

      <Button
        variant="secondary"
        label="This is the secondary flat button in a disabled state"
        disabled
      >
        Secondary disabled
      </Button>

      <Button variant="vip" label="This is the VIP flat button">
        Flat VIP
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
        {#snippet icon()}
          <VipIcon />
        {/snippet}
      </Button>

      <Button
        variant="custom"
        label="This is the custom flat button"
        style="flat"
        --color-background-button="darkorange"
      >
        Flat custom
      </Button>

      <Button
        variant="custom"
        label="This is the custom flat button in a disabled state"
        style="flat"
        disabled
      >
        Custom disabled
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
        {#snippet icon()}
          <VipIcon />
        {/snippet}
      </Button>

      <Button
        variant="custom"
        label="This is the custom ghost button"
        style="ghost"
        --color-background-button="darkorange"
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

    <section>
      <h2>Action</h2>

      <div class="action-button-demo">
        <ActionButton label="Purple action button" variant="purple">
          <CheckIcon />
        </ActionButton>

        Variant: purple
      </div>

      <div class="action-button-demo">
        <ActionButton label="Red action button" variant="red">
          <CheckIcon />
        </ActionButton>

        Variant: red
      </div>

      <div class="action-button-demo">
        <ActionButton label="Blue action button" variant="blue">
          <CheckIcon />
        </ActionButton>

        Variant: blue
      </div>

      <div class="action-button-demo">
        <ActionButton label="Default action button">
          <CheckIcon />
        </ActionButton>

        Variant: default
      </div>
    </section>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);
    padding-top: var(--ni-32);
    align-items: center;

    @media (max-width: 768px) {
      .button-display {
        flex-direction: column;
        align-items: center;
        gap: var(--ni-32);
      }
    }

    section {
      display: flex;
      flex-direction: column;
      gap: var(--ni-16);
      align-items: start;
    }
  }

  .button-display {
    display: flex;
    justify-content: space-between;

    width: 75%;
  }

  .action-button-demo {
    display: flex;
    gap: var(--ni-16);
    align-items: center;
  }
</style>
