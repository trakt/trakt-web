<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
</script>

<span class="trakt-own-comment-label">{m.text_your_comment()}</span>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-own-comment-label {
    @include visually-hidden;
  }
</style>
