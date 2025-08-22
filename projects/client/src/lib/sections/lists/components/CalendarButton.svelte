<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<ActionButton
  href={UrlBuilder.calendar()}
  label={m.button_label_calendar()}
  style="ghost"
>
  <CalendarIcon />
</ActionButton>
