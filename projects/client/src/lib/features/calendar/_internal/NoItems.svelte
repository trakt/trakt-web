<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import { shuffle } from "$lib/utils/array/shuffle";

  const NO_ITEMS_MESSAGES = [
    m.text_calendar_placeholder_1(),
    m.text_calendar_placeholder_2(),
    m.text_calendar_placeholder_3(),
    m.text_calendar_placeholder_4(),
    m.text_calendar_placeholder_5(),
    m.text_calendar_placeholder_6(),
    m.text_calendar_placeholder_7(),
    m.text_calendar_placeholder_8(),
    m.text_calendar_placeholder_9(),
    m.text_calendar_placeholder_10(),
  ];
</script>

<p class="meta-info secondary no-content">
  {shuffle(NO_ITEMS_MESSAGES).at(0)}
</p>

<style>
  .no-content {
    padding: var(--ni-16);
  }
</style>
