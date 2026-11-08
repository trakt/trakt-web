<script lang="ts">
  import CounterNumber from "$lib/components/counter/CounterNumber.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MemberCountProps } from "./_internal/MemberCountProps.ts";
  import { toAnnounceValue } from "./_internal/toAnnounceValue.ts";
  import { toMemberCountLabel } from "./_internal/toMemberCountLabel.ts";

  const { count }: MemberCountProps = $props();

  const announced = $derived(
    count.value === null ? null : toAnnounceValue(count.value),
  );
  const accessibleLabel = $derived(
    announced === null ? "" : toMemberCountLabel(announced),
  );
</script>

<section class="trakt-member-count-hero">
  <p class="member-count-eyebrow tag uppercase">
    {m.label_registered_accounts()}
  </p>

  <div class="member-count-figure">
    {#if count.value === null}
      <div class="member-count-placeholder">
        <Skeleton width="5.6em" height="1em" radius="var(--border-radius-m)" />
      </div>
    {:else}
      <CounterNumber value={count.value} {accessibleLabel} />
    {/if}
  </div>

  <p class="member-count-tagline secondary">{m.text_member_count_tagline()}</p>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-member-count-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-s);

    width: 100%;
    text-align: center;
  }

  .member-count-eyebrow {
    letter-spacing: var(--ni-2);
    color: var(--purple-400);
  }

  .member-count-figure {
    font-size: var(--ni-96);
    font-weight: 700;
    // The number is the headline, so the digits are set tighter than body copy.
    letter-spacing: -0.03em;
    line-height: 1;

    // Not a `background-clip: text` gradient: transformed strips contribute no
    // glyphs to a text clip, so a gradient renders only the separators.
    color: var(--color-text-primary);

    transition: font-size var(--transition-increment) ease-in-out;

    @include for-tablet-lg-and-below {
      font-size: var(--ni-72);
    }

    @include for-mobile {
      font-size: var(--ni-40);
    }
  }

  .member-count-placeholder {
    display: flex;
    justify-content: center;
  }

  .member-count-tagline {
    font-size: var(--ni-18);
    max-width: var(--ni-480);

    @include for-mobile {
      font-size: var(--font-size-text);
    }
  }
</style>
