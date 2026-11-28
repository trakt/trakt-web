<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const { tone }: { tone: "must-watch" | "optional" | "current" } = $props();

  const text = $derived.by(() => {
    switch (tone) {
      case "must-watch":
        return m.tag_text_movie_lore_must_watch();
      case "optional":
        return m.tag_text_movie_lore_optional();
      case "current":
        return m.tag_text_movie_lore_this_film();
    }
  });
</script>

<span class="trakt-movie-lore-tag" data-tone={tone}>
  <StemTag {text} />
</span>

<style lang="scss">
  .trakt-movie-lore-tag {
    display: inline-flex;
    min-width: 0;

    --color-background-stem-tag: var(--color-background-cover-tag);
    --shadow-stem-tag: var(--shadow-cover-tag);

    &[data-tone="must-watch"] {
      --color-background-stem-tag: var(--purple-500);
      --shadow-stem-tag: none;
    }
  }
</style>
