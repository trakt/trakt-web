<script>
  import ConfirmationProvider from "$lib/features/confirmation/ConfirmationProvider.svelte";
  import TestProvider from "../_internal/TestProvider.svelte";

  const input = $props();
</script>

<TestProvider>
  <ConfirmationProvider>
    <input.component {...input.props} />
  </ConfirmationProvider>
</TestProvider>
