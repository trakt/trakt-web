<script>
  import TestProvider from "../_internal/TestProvider.svelte";

  const input = $props();
</script>

<TestProvider>
  <input.component {...input.props} />
</TestProvider>
