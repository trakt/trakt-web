<script lang="ts">
  import Subscriptions from "./_internal/Subscriptions.svelte";
  import UpsellFooter from "./_internal/UpsellFooter.svelte";
  import UpsellHeader from "./_internal/UpsellHeader.svelte";
  import VipContent from "./_internal/VipContent.svelte";
  import VipFeatures from "./_internal/VipFeatures.svelte";
</script>

<VipContent>
  <UpsellHeader />
  <Subscriptions />
  <VipFeatures />
  <UpsellFooter />
</VipContent>
