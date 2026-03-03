<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
</script>

<div class="trakt-empty-calendar-period">
  <p class="secondary bold">
    {m.text_calendar_placeholder_empty_period()}
  </p>
</div>

<style>
  .trakt-empty-calendar-period {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: var(--ni-24);
  }
</style>
