<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import VipIcon from "$lib/components/icons/VipIcon.svelte";
  import WatchNowIcon from "$lib/components/icons/WatchNowIcon.svelte";

  import type { TraktButtonProps } from "$lib/components/buttons/TraktButtonProps";

  const styles: TraktButtonProps["style"][] = ["textured", "flat", "ghost"];
  const colors: TraktButtonProps["color"][] = ["purple", "red", "blue"];
  const variants: NonNullable<TraktButtonProps["variant"]>[] = [
    "primary",
    "secondary",
  ];
</script>

<main>
  <h1>Buttons</h1>

  <div class="button-display">
    {#each styles as style}
      <section>
        <h2 class="capitalize">{style}</h2>
        {#each colors as color}
          <Button label={`This is the primary {style} button`} {style} {color}>
            {style} Icon
            {#snippet icon()}
              {#if color === "purple"}
                <WatchNowIcon />
              {/if}

              {#if color === "blue"}
                <CheckIcon />
              {/if}

              {#if color === "red"}
                <VipIcon />
              {/if}
            {/snippet}
          </Button>
          {#each variants as variant}
            <Button
              label={`This is the ${variant} ${style} ${color} button`}
              {variant}
              {style}
              {color}
            >
              {style}
              {variant}
            </Button>
            <Button
              label={`This is the ${variant} ${style} ${color} button in a disabled state`}
              disabled
              {variant}
              {style}
              {color}
            >
              {style}
              {variant}
            </Button>
          {/each}
        {/each}
        <Button
          color="custom"
          label="This is the custom flat button"
          {style}
          --color-background-custom="darkorange"
          --color-foreground-custom="lightgoldenrodyellow"
        >
          {style} Custom
        </Button>
        <Button
          color="custom"
          label="This is the custom flat button"
          disabled
          {style}
          --color-background-button="darkorange"
          --color-foreground-button="lightgoldenrodyellow"
        >
          {style} Custom disabled
        </Button>
      </section>
    {/each}

    <section>
      <h2>Action</h2>

      <div class="action-button-demo">
        <ActionButton label="Purple action button" color="purple">
          <CheckIcon />
        </ActionButton>

        <ActionButton
          label="Purple action button"
          color="purple"
          variant="secondary"
        >
          <CheckIcon />
        </ActionButton>

        Variant: purple
      </div>

      <div class="action-button-demo">
        <ActionButton label="Red action button" color="red">
          <CheckIcon />
        </ActionButton>

        <ActionButton label="Red action button" color="red" variant="secondary">
          <CheckIcon />
        </ActionButton>

        Variant: red
      </div>

      <div class="action-button-demo">
        <ActionButton label="Blue action button" color="blue">
          <CheckIcon />
        </ActionButton>

        <ActionButton
          label="Blue action button"
          color="blue"
          variant="secondary"
        >
          <CheckIcon />
        </ActionButton>

        Variant: blue
      </div>

      <div class="action-button-demo">
        <ActionButton label="Default action button">
          <CheckIcon />
        </ActionButton>

        <ActionButton label="Default action button" variant="secondary">
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
