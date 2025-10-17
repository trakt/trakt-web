<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import WatchNowIcon from "$lib/components/icons/WatchNowIcon.svelte";
  import YouTubeIcon from "$lib/components/icons/YouTubeIcon.svelte";

  import type { TraktActionButtonProps } from "$lib/components/buttons/TraktActionButtonProps";
  import type { TraktButtonProps } from "$lib/components/buttons/TraktButtonProps";

  const styles: TraktButtonProps["style"][] = [
    "textured",
    "flat",
    "ghost",
    "underlined",
  ];
  const colors: TraktActionButtonProps["color"][] = [
    "purple",
    "red",
    "blue",
    "default",
  ];
  const variants: NonNullable<TraktButtonProps["variant"]>[] = [
    "primary",
    "secondary",
  ];

  const actionButtonStyles: TraktActionButtonProps["style"][] = [
    "flat",
    "ghost",
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
                <YouTubeIcon />
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

      {#each actionButtonStyles as actionStyle}
        <h3 class="capitalize">{actionStyle}</h3>
        {#each colors as color}
          <div class="action-button-demo">
            {#each variants as variant}
              <ActionButton
                label={`${color} ${actionStyle} action button`}
                {color}
                {variant}
                style={actionStyle}
              >
                <YouTubeIcon />
              </ActionButton>
            {/each}

            Variant: {color}
            {actionStyle}
          </div>
        {/each}
      {/each}
    </section>
  </div>
</main>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  main {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    padding-top: var(--ni-32);
    align-items: center;

    @include for-tablet-sm-and-below {
      .button-display {
        flex-direction: column;
        align-items: center;
        gap: var(--gap-xl);
      }
    }

    section {
      display: flex;
      flex-direction: column;
      gap: var(--gap-m);
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
    gap: var(--gap-m);
    align-items: center;
  }
</style>
