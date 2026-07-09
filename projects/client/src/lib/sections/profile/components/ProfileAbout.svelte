<script lang="ts">
  import ClampedText from "$lib/components/text/ClampedText.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ShadowScroller from "$lib/sections/components/ShadowScroller.svelte";

  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import type { DisplayableProfileProps } from "../DisplayableProfileProps";

  const { profile, slug }: DisplayableProfileProps = $props();

  const { isMe } = $derived(useIsMe(slug));
  const aboutHeader = $derived(
    $isMe
      ? m.text_about()
      : m.text_about_user({ username: toDisplayableName(profile) }),
  );

  const aboutText = $derived(profile.about);
</script>

{#if aboutText}
  <div class="trakt-profile-about">
    <span class="secondary bold">{aboutHeader}</span>
    <RenderFor audience="all" device={["desktop", "tablet-lg"]}>
      <ShadowScroller>
        <p>{aboutText}</p>
      </ShadowScroller>
    </RenderFor>

    <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
      <ClampedText label={m.button_label_read_more()}>
        {aboutText}
      </ClampedText>
    </RenderFor>
  </div>
{/if}

<style>
  .trakt-profile-about {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    :global(.trakt-shadow-wrapper) {
      flex: 1 1 0;
      min-height: 0;
    }
  }
</style>
