<script lang="ts">
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import ApiApplicationForm from "./ApiApplicationForm.svelte";
  import type { ApiApplicationFormSectionProps } from "./ApiApplicationFormSectionProps.ts";

  const {
    title,
    description,
    crumbHref,
    crumbLabel,
    initial,
    isBusy = false,
    errorMessage,
    onDismissError,
    confirmButtonText,
    confirmButtonLabel,
    onSubmit,
    onCancel,
  }: ApiApplicationFormSectionProps = $props();
</script>

<SettingsGroupCard
  {title}
  {description}
  crumb={{ href: crumbHref, label: crumbLabel }}
>
  <ApiApplicationForm
    {initial}
    {isBusy}
    {errorMessage}
    {onDismissError}
    {confirmButtonText}
    {confirmButtonLabel}
    {onSubmit}
    {onCancel}
  />
</SettingsGroupCard>
