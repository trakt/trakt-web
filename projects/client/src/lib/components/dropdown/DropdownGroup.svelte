<script lang="ts">
  type DropdownGroupProps = {
    style?: "card" | "flat" | "menu";
  } & ChildrenProps;

  const { children, style = "card" }: DropdownGroupProps = $props();
</script>

<ul class="trakt-dropdown-group" data-style={style}>
  {@render children()}
</ul>

<style lang="scss">
  .trakt-dropdown-group {
    all: unset;

    display: grid;
    grid-template-columns: 100%;

    border-radius: var(--dropdown-group-border-radius, var(--border-radius-l));
    overflow: hidden;

    &[data-style="card"] {
      background: var(--color-option-list-background);
      border: var(--ni-1) solid var(--color-option-list-border);
    }

    &[data-style="menu"] {
      gap: var(--ni-2);

      border-radius: 0;
      overflow: visible;
    }
  }
</style>
