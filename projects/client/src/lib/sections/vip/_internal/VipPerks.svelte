<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { revealOnView } from "$lib/utils/actions/revealOnView";
  import { VIP_FEATURES } from "./VIP_FEATURES";
  import VipContentContainer from "./VipContentContainer.svelte";
  import VipHeader from "./VipHeader.svelte";
</script>

<VipContentContainer>
  {#snippet header()}
    <VipHeader>
      {m.header_vip_your_perks()}

      {#snippet description()}
        <span class="secondary">{m.text_vip_features_tagline()}</span>
      {/snippet}
    </VipHeader>
  {/snippet}

  <ul class="trakt-vip-perks">
    {#each VIP_FEATURES as feature, index (feature.title)}
      <li
        class="trakt-vip-perk"
        use:revealOnView={{ delay: Math.min(index * 60, 400) }}
      >
        <span class="perk-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5L10 17.5L19 7.5"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span>{feature.title()}</span>
      </li>
    {/each}
  </ul>
</VipContentContainer>

<style>
  .trakt-vip-perks {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--gap-xs);

    margin: 0;
    padding: 0;

    list-style: none;
  }

  .trakt-vip-perk {
    box-sizing: border-box;

    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    min-height: var(--ni-36);
    padding: var(--ni-4) var(--ni-14) var(--ni-4) var(--ni-6);

    background: var(--color-card-background);
    border-radius: var(--border-radius-pill);
    box-shadow: var(--shadow-base);

    font-size: var(--font-size-text-small);
  }

  .perk-check {
    display: flex;
    align-items: center;
    justify-content: center;

    flex: none;
    width: var(--ni-24);
    height: var(--ni-24);

    background: radial-gradient(
      circle at 35% 30%,
      var(--purple-400),
      var(--purple-500)
    );
    border-radius: 50%;
    color: var(--shade-10);

    svg {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }
</style>
