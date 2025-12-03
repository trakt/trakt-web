<script lang="ts">
  import ClampedText from "$lib/components/text/ClampedText.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import * as m from "$lib/features/i18n/messages";

  import { shuffle } from "$lib/utils/array/shuffle";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import type { DisplayableProfileProps } from "../DisplayableProfileProps";

  const { profile, slug }: DisplayableProfileProps = $props();

  const ABOUT_MESSAGES = [
    m.text_about_placeholder_1(),
    m.text_about_placeholder_2(),
    m.text_about_placeholder_3(),
    m.text_about_placeholder_4(),
    m.text_about_placeholder_5(),
    m.text_about_placeholder_6(),
    m.text_about_placeholder_7(),
    m.text_about_placeholder_8(),
    m.text_about_placeholder_9(),
    m.text_about_placeholder_10(),
    m.text_about_placeholder_11(),
    m.text_about_placeholder_12(),
    m.text_about_placeholder_13(),
    m.text_about_placeholder_14(),
    m.text_about_placeholder_15(),
  ];

  const { isMe } = $derived(useIsMe(slug));
  const aboutText = $derived(
    $isMe
      ? m.text_about()
      : m.text_about_user({ username: toDisplayableName(profile) }),
  );
</script>

<div class="trakt-profile-about">
  <span class="secondary bold">{aboutText}</span>
  <ClampedText
    classList="trakt-profile-about"
    label={m.button_label_read_more()}
  >
    {profile.about ?? shuffle(ABOUT_MESSAGES).at(0)}
  </ClampedText>
</div>

<style>
  .trakt-profile-about {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
