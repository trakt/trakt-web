<script lang="ts">
  import MoreButton from "$lib/components/buttons/more/MoreButton.svelte";
  import { MoreButtonIntlProvider } from "$lib/components/buttons/more/MoreButtonIntlProvider";
  import { lineClamp } from "$lib/components/text/lineClamp";
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import { writable } from "$lib/utils/store/WritableSubject";

  type LineClampProps = {
    label: string;
    classList?: string;
  } & ChildrenProps;

  const { children, label, classList = "" }: LineClampProps = $props();

  const isClamped = writable(false);
  const lines = writable(3);
  const isExpanded = $derived($lines === 1337);
</script>

<div class="line-clamp-container">
  <p
    use:lineClamp={{ lines: $lines, isClamped }}
    use:appendClassList={classList}
    class="line-clamp-content"
  >
    {@render children()}
  </p>

  {#if $isClamped || isExpanded}
    <MoreButton
      i18n={MoreButtonIntlProvider}
      {label}
      count={undefined}
      onCollapse={() => lines.set(3)}
      onExpand={() => lines.set(1337)}
    />
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .line-clamp-container {
    display: flex;
    align-items: flex-end;

    gap: var(--gap-xs);

    @include for-tablet-sm-and-below {
      flex-direction: column;
    }
  }

  .line-clamp-content {
    line-height: 150%;
  }
</style>
