<script lang="ts">
  import RenewCard from "./RenewCard.svelte";
  import UnsubscribeCard from "./UnsubscribeCard.svelte";
  import UpdateCard from "./UpdateCard.svelte";
</script>

<div class="trakt-vip-manage-subscriptions">
  <!-- TODO only if auto renewal -->
  <UpdateCard />

  <!-- TODO only if no auto renewal -->
  <RenewCard />

  <!-- TODO only if not lifetime vip-->
  <UnsubscribeCard />
</div>

<style>
  .trakt-vip-manage-subscriptions {
    display: flex;
    gap: var(--ni-24);
    justify-content: center;
  }
</style>
