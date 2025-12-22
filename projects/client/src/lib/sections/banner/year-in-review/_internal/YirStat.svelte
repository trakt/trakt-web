<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";

  const {
    value,
    label,
    children,
  }: {
    value: number;
    label: string;
  } & ChildrenProps = $props();
</script>

<div class="trakt-yir-stat-container">
  <div class="trakt-yir-stat-icon">
    {@render children()}
  </div>

  <div class="trakt-yir-stat">
    <p class="bold">{toHumanNumber(value, languageTag())}</p>
    <p class="tag uppercase">{label}</p>
  </div>
</div>

<style>
  .trakt-yir-stat-container {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .trakt-yir-stat-icon {
    display: flex;
    justify-content: center;
  }

  .trakt-yir-stat {
    display: flex;
    flex-direction: column;
    justify-content: center;

    p {
      line-height: var(--font-size-text);
    }

    p.tag {
      line-height: var(--font-size-tag);
    }
  }
</style>
