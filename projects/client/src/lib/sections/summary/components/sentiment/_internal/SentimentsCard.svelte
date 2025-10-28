<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import type { Sentiments } from "$lib/requests/models/Sentiments";
  import SentimentsList from "./SentimentsList.svelte";

  const { sentiments }: { sentiments: Sentiments } = $props();
</script>

<div class="trakt-sentiments-card">
  <Card
    --width-card="var(--width-sentiments-card)"
    --height-card="var(--height-sentiments-card)"
  >
    <div class="trakt-sentiments-container">
      <SentimentsList {sentiments} />
    </div>
  </Card>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-sentiments-card {
    @include for-mobile() {
      --width-override-card: calc(100dvw - 2 * var(--layout-distance-side));
    }
  }

  .trakt-sentiments-container {
    border-radius: var(--border-radius-m);

    height: 100%;
    width: 100%;

    position: relative;
    display: flex;

    padding: var(--ni-16);
    box-sizing: border-box;

    background: var(--sentiments-background);
  }
</style>
