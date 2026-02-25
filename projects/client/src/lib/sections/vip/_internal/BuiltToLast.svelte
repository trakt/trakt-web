<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import GlassCard from "./GlassCard.svelte";
  import HeartIcon from "./icons/HeartIcon.svelte";

  const COST_DESCRIPTIONS = [
    m.text_vip_costs_team(),
    m.text_vip_costs_infrastructure(),
    m.text_vip_costs_moderation(),
    m.text_vip_costs_independence(),
  ] as const;
</script>

<GlassCard>
  <div class="trakt-vip-built-to-last">
    <HeartIcon />

    <h2>{m.text_vip_built_to_last()}</h2>

    <p class="bold">{m.text_vip_costs()}</p>

    <ul>
      {#each COST_DESCRIPTIONS as description}
        <li>
          <p>{description}</p>
        </li>
      {/each}
    </ul>
  </div>
</GlassCard>

<style>
  .trakt-vip-built-to-last {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);

    ul {
      padding: 0;
      padding-left: var(--ni-18);
      margin: 0;
    }
  }
</style>
