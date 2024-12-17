<script>
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import VipIcon from "$lib/components/icons/VipIcon.svelte";
  import WatchNowIcon from "$lib/components/icons/WatchNowIcon.svelte";
</script>

{#snippet items()}
  <DropdownItem
    onclick={() => {
      console.log("Get Schiwfty!");
    }}
  >
    Click me
  </DropdownItem>
  <DropdownItem href="/movies">Got To Movies</DropdownItem>
  <DropdownItem
    style="danger"
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
    <section>
      <h2>Primary</h2>
      <DropdownList {items} label="This is the primary dropdown">
        Icon
        {#snippet icon()}
          <WatchNowIcon />
        {/snippet}
      </DropdownList>

      <DropdownList {items} label="This is the primary dropdown"
        >primary</DropdownList
      >

      <DropdownList
        {items}
        label="This is the primary dropdown in a disabled state"
        disabled
      >
        disabled
      </DropdownList>
    </section>

    <section>
      <h2>Secondary</h2>
      <DropdownList
        {items}
        variant="secondary"
        label="This is the secondary dropdown"
      >
        secondary
      </DropdownList>

      <DropdownList
        {items}
        variant="secondary"
        label="This is the secondary dropdown in a disabled state"
        disabled
      >
        Secondary disabled
      </DropdownList>
    </section>

    <section>
      <h2>VIP</h2>
      <DropdownList {items} variant="vip" label="This is the VIP dropdown">
        VIP
        {#snippet icon()}
          <VipIcon />
        {/snippet}
      </DropdownList>

      <DropdownList
        {items}
        variant="vip"
        label="This is the VIP dropdown in a disabled state"
        disabled
      >
        VIP disabled
        {#snippet icon()}
          <VipIcon />
        {/snippet}
      </DropdownList>
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
</style>
