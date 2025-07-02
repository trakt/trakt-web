<script lang="ts">
  import ClampedText from "$lib/components/text/ClampedText.svelte";
  import * as m from "$lib/features/i18n/messages";

  import { shuffle } from "$lib/utils/array/shuffle";

  const { about }: { about: string | Nil } = $props();

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
</script>

<ClampedText classList="trakt-profile-about" label={m.button_label_read_more()}>
  {about ?? shuffle(ABOUT_MESSAGES).at(0)}
</ClampedText>
