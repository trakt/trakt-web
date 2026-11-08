<script lang="ts">
  import { useRegisteredMemberCount } from "$lib/features/member-count/useRegisteredMemberCount.svelte.ts";
  import MeetTheTeam from "./components/MeetTheTeam.svelte";
  import MemberCountHero from "./components/MemberCountHero.svelte";
  import WhatIsTrakt from "./components/WhatIsTrakt.svelte";

  // Owned here so the page polls once, not once per presentation.
  const count = useRegisteredMemberCount();
</script>

<div class="trakt-about">
  <WhatIsTrakt />
  <MemberCountHero {count} />
  <MeetTheTeam />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-about {
    --top-bottom-padding: var(--ni-64);

    display: flex;
    flex-direction: column;
    gap: calc(2 * var(--gap-xxl));

    align-self: center;
    max-width: var(--ni-1280);
    width: 100%;
    box-sizing: border-box;

    padding: var(--top-bottom-padding) var(--layout-distance-side);

    transition:
      padding var(--transition-increment) ease-in-out,
      gap var(--transition-increment) ease-in-out;

    @include for-tablet-sm-and-below {
      --top-bottom-padding: var(--ni-36);
      gap: calc(1.5 * var(--gap-xxl));
    }

    @include for-mobile {
      --top-bottom-padding: var(--ni-24);
    }
  }
</style>
