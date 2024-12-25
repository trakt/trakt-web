<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import type { TraktDropdownListProps } from "$lib/components/dropdown/TraktDropdownListProps";
  import WatchNowIcon from "$lib/components/icons/WatchNowIcon.svelte";

  const colors: TraktDropdownListProps["color"][] = ["purple", "red", "blue"];
  const variants: NonNullable<TraktDropdownListProps["variant"]>[] = [
    "primary",
    "secondary",
  ];
  const styles: TraktDropdownListProps["style"][] = ["textured", "flat"];
</script>

{#snippet items()}
  <DropdownItem
    onclick={() => {
      console.log("Get Schwifty!");
    }}
  >
    Click me
  </DropdownItem>
  <DropdownItem href="/movies">Got To Movies</DropdownItem>
  <DropdownItem
    color="red"
    onclick={() => {
      console.log("Danger zone...");
    }}
  >
    Maybe click me?
  </DropdownItem>
{/snippet}

<main>
  <h1>Dropdowns</h1>

  <div class="button-display">
    {#each styles as style}
      <section>
        <h2 class="capitalize">{style}</h2>
        {#each colors as color}
          <DropdownList
            {items}
            {color}
            {style}
            label={`This is the ${style} ${color} dropdown`}
          >
            Icon
            {#snippet icon()}
              <WatchNowIcon />
            {/snippet}
          </DropdownList>

          {#each variants as variant}
            <DropdownList
              {color}
              {variant}
              {style}
              {items}
              label={`This is the ${variant} ${style} ${color} dropdown`}
            >
              {variant}
            </DropdownList>

            <DropdownList
              {items}
              {variant}
              {style}
              label={`This is the ${variant} ${style} ${color} dropdown in a disabled state`}
              disabled
            >
              {variant} Disabled
            </DropdownList>
          {/each}
        {/each}
      </section>
    {/each}
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
</style>
