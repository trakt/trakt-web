<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import * as m from "$lib/features/i18n/messages";
  import posterUrl from "./game-poster.svg";
</script>

<CardCover title={m.header_game_rated_higher()} src={posterUrl} alt="" />
