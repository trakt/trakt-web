<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import FooterCard from "./FooterCard.svelte";
  import HeartIcon from "./icons/HeartIcon.svelte";

  const COST_DESCRIPTIONS = [
    m.text_vip_costs_team(),
    m.text_vip_costs_infrastructure(),
    m.text_vip_costs_moderation(),
    m.text_vip_costs_independence(),
  ] as const;
</script>

<FooterCard title={m.text_vip_costs()}>
  {#snippet icon()}
    <HeartIcon />
  {/snippet}

  <div class="trakt-vip-cost-descriptions">
    <ul>
      {#each COST_DESCRIPTIONS as description}
        <li>
          <p>{description}</p>
        </li>
      {/each}
    </ul>
  </div>
</FooterCard>

<style>
  .trakt-vip-cost-descriptions {
    ul {
      padding: 0;
      padding-left: var(--ni-18);
      margin: 0;
    }
  }
</style>
