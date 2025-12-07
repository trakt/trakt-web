<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";

  const props = [
    { color: "purple" as const, checked: true, innerText: "Web" },
    { color: "red" as const, checked: false },
    { color: "blue" as const, checked: true },
    { color: "orange" as const, checked: false },
  ];
</script>

<main>
  <h1>Toggles</h1>

  <div class="toggle-display">
    <section>
      <h2 class="capitalize">Switches</h2>
      {#each props as { color, checked, innerText }}
        <Switch
          {checked}
          label={`This is the ${color} switch`}
          {color}
          {innerText}
        />
      {/each}
      <Switch checked={true} label="This is the disabled switch" disabled />
      <Switch label="This is the disabled switch" innerText="Web" disabled />
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
      .toggle-display {
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

  .toggle-display {
    display: flex;
    justify-content: space-between;

    width: 75%;
  }
</style>
