<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import WatchNowIcon from "$lib/components/icons/WatchNowIcon.svelte";
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

  <section>
    <DropdownList {items} label="Dropdown with icon">
      With Icon
      {#snippet icon()}
        <WatchNowIcon />
      {/snippet}
    </DropdownList>

    <DropdownList {items} label="Dropdown">Default</DropdownList>

    <DropdownList {items} label="Disabled dropdown" disabled>
      Disabled
    </DropdownList>
  </section>
</main>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  main {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
    padding-top: var(--ni-32);
    align-items: center;

    section {
      display: flex;
      flex-direction: column;
      gap: var(--gap-m);
      align-items: start;
    }
  }
</style>
