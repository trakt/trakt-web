<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { getLocale } from "$lib/features/i18n";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import GetVIPLink from "./../GetVIPLink.svelte";

  const today = new Date();
  // TODO viplink scroll behaviour
  // TODO util + intl
  function getGreeting(date: Date): string {
    const hour = date.getHours();

    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "Good evening";
    } else {
      return "Good night";
    }
  }

  const greeting = getGreeting(today);

  const { user } = useUser();
  const isVip = $derived(!!$user?.isVip);
</script>

{#snippet greetingContent()}
  <p class="small">{greeting}</p>
  <p class="secondary smaller">{toHumanDay(today, getLocale())}</p>
{/snippet}

<div class="trakt-greeting">
  <RenderFor audience="public">
    {@render greetingContent()}
  </RenderFor>

  <RenderFor audience="authenticated">
    {#if isVip}
      {@render greetingContent()}
    {:else}
      <GetVIPLink />
    {/if}
  </RenderFor>
</div>

<style>
  .trakt-greeting {
    display: flex;
    flex-direction: column;

    p {
      font-weight: 700;
    }

    p.smaller {
      font-weight: 600;
    }
  }
</style>
