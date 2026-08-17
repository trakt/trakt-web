<script lang="ts">
  import type { ConfirmationContentProps } from "./ConfirmationContentProps.ts";
  import { ConfirmationType } from "../models/ConfirmationType.ts";
  import ConfirmationPreviewImage from "./ConfirmationPreviewImage.svelte";

  const { params }: ConfirmationContentProps = $props();

  const url = $derived(
    params.type === ConfirmationType.SetCoverImage ? params.previewUrl : null,
  );
</script>

{#if url}
  <ConfirmationPreviewImage {url} />
{/if}
