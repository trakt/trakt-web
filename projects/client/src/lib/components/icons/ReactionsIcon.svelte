<script lang="ts">
  import ReactionIcon from "./ReactionIcon.svelte";
</script>

<!--
  No-prop wrapper around the ReactionIcon primitive so it can be used where a
  bare `Component` icon is expected (e.g. the feature-flag definitions).
-->
<ReactionIcon state="default" />
