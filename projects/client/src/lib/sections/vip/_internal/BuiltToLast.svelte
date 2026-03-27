<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import FooterCard from "./FooterCard.svelte";
  import BuiltToLastIcon from "./icons/BuiltToLastIcon.svelte";

  const costDescriptions = [
    m.text_vip_costs_metadata(),
    m.text_vip_costs_infrastructure(),
    m.text_vip_costs_clients(),
    m.text_vip_costs_team(),
  ] as const;
</script>

<FooterCard title={m.text_vip_built_to_last()}>
  {#snippet icon()}
    <div class="trakt-vip-icon-circle">
      <BuiltToLastIcon />
    </div>
  {/snippet}

  <div class="trakt-vip-cost-descriptions">
    <p>{m.text_vip_costs()}</p>
    <ul>
      {#each costDescriptions as description}
        <li>{description}</li>
      {/each}
    </ul>
  </div>
</FooterCard>

<style>
  .trakt-vip-icon-circle {
    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-48);
    height: var(--ni-48);

    background: var(--shade-10);
    border-radius: 50%;
  }

  .trakt-vip-cost-descriptions {
    align-self: stretch;

    p {
      margin: 0 0 var(--ni-8);
    }

    ul {
      padding: 0;
      padding-left: var(--ni-18);
      margin: var(--ni-20) 0 0 0;

      li {
        margin-bottom: var(--ni-4);
      }
    }
  }
</style>
