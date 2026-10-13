<script lang="ts">
  import DropdownGroup from "$lib/components/dropdown/DropdownGroup.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import WatchNowIcon from "$lib/components/icons/WatchNowIcon.svelte";

  const groupStyles = ["card", "flat"] as const;
</script>

{#snippet watchIcon()}
  <WatchNowIcon />
{/snippet}

{#snippet check()}
  <CheckIcon />
{/snippet}

{#snippet subtitle()}
  Supporting copy for the row
{/snippet}

{#snippet rows()}
  <DropdownItem onclick={() => {}}>Default row</DropdownItem>
  <DropdownItem icon={watchIcon} {subtitle} onclick={() => {}}>
    With icon and subtitle
  </DropdownItem>
  <DropdownItem selected end={check} onclick={() => {}}>
    Selected row
  </DropdownItem>
  <DropdownItem href="/movies">Link row</DropdownItem>
  <DropdownItem color="red" onclick={() => {}}>Destructive row</DropdownItem>
  <DropdownItem disabled onclick={() => {}}>Disabled row</DropdownItem>
{/snippet}

<main>
  <div class="display">
    {#each groupStyles as style (style)}
      <section>
        <h2 class="capitalize">{style} group</h2>
        <DropdownGroup {style}>
          {@render rows()}
        </DropdownGroup>
      </section>
    {/each}

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
      .display {
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

      min-width: var(--ni-280);
    }
  }

  .display {
    display: flex;
    justify-content: space-between;
    align-items: start;

    width: 75%;
  }
</style>
