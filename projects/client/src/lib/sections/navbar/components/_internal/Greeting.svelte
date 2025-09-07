<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { getLocale } from "$lib/features/i18n";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import GetVIPLink from "./../GetVIPLink.svelte";
  import { getGreeting } from "./getGreeting";

  const today = new Date();
  const greeting = getGreeting();

  const { user } = useUser();
  const isVip = $derived(!!$user?.isVip);
</script>

{#snippet greetingContent()}
  <div class="trakt-greeting">
    <p class="small">{greeting}</p>
    <p class="secondary smaller">{toHumanDay(today, getLocale())}</p>
  </div>
{/snippet}

<RenderFor audience="public">
  {@render greetingContent()}
</RenderFor>

<RenderFor audience="authenticated">
  <div class="trakt-greeting-container" class:is-vip={isVip}>
    {@render greetingContent()}

    {#if !isVip}
      <GetVIPLink />
    {/if}
  </div>
</RenderFor>

<style>
  .trakt-greeting-container:not(.is-vip) {
    position: relative;

    :global(trakt-get-vip-link) {
      position: absolute;
      top: var(--ni-2);

      opacity: 0;
      transition: opacity var(--transition-increment) ease-in-out;
    }
  }

  .trakt-greeting {
    display: flex;
    flex-direction: column;

    transition: opacity var(--transition-increment) ease-in-out;

    p {
      font-weight: 700;
    }

    p.smaller {
      font-weight: 600;
    }
  }

  :global(.trakt-navbar-scroll-up) {
    .trakt-greeting-container:not(.is-vip) {
      :global(trakt-get-vip-link) {
        opacity: 1;
      }

      .trakt-greeting {
        opacity: 0;
      }
    }
  }
</style>
