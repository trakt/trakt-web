<script lang="ts">
  type DropdownGroupProps = {
    style?: "card" | "flat";
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

    border-radius: var(--border-radius-l);
    overflow: hidden;

    &[data-style="card"] {
      background: var(--color-option-list-background);
      border: var(--ni-1) solid var(--color-option-list-border);
    }
  }
</style>
