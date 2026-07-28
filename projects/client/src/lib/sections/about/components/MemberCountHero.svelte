<script lang="ts">
  import OdometerNumber from "$lib/components/counter/OdometerNumber.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MemberCountProps } from "./_internal/MemberCountProps.ts";
  import { toAnnounceValue } from "./_internal/toAnnounceValue.ts";
  import { toMemberCountLabel } from "./_internal/toMemberCountLabel.ts";

  const { count }: MemberCountProps = $props();

  const announced = $derived(toAnnounceValue(count.value));
  const accessibleLabel = $derived(toMemberCountLabel(announced));
</script>

<section class="trakt-member-count-hero">
  <p class="member-count-eyebrow tag uppercase">
    {m.label_registered_accounts()}
  </p>

  <div class="member-count-figure">
    <OdometerNumber
      value={count.value}
      reserveFor={count.reserveFor}
      {accessibleLabel}
    />
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

  .member-count-tagline {
    font-size: var(--ni-18);
    max-width: var(--ni-480);

    @include for-mobile {
      font-size: var(--font-size-text);
    }
  }
</style>
