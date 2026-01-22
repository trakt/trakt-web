<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import IconWrapper from "$lib/components/icons/IconWrapper.svelte";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import ActionButton from "../ActionButton.svelte";
  import Button from "../Button.svelte";
  import SquaredLogo from "./_internal/SquaredLogo.svelte";
  import { CheckInButtonIntlProvider } from "./CheckInButtonIntlProvider";
  import type { CheckInButtonProps } from "./CheckInButtonProps";

  const {
    i18n = CheckInButtonIntlProvider,
    title,
    style,
    isCheckingIn,
    isCheckedIn,
    checkin,
    variant = "secondary",
    ...props
  }: CheckInButtonProps = $props();

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: i18n.label({ title }),
    color: "default",
    variant,
    onclick: checkin,
    disabled: isCheckingIn || isCheckedIn,
  });
</script>

{#snippet icon()}
  <IconWrapper isLoading={isCheckingIn}>
    <SquaredLogo />
  </IconWrapper>
{/snippet}

{#if style === "normal"}
  <div data-dpad-navigation={DpadNavigationType.List} style="display: contents">
    <Button
      {...commonProps}
      {...props}
      {icon}
      navigationType={DpadNavigationType.Item}
    >
      {i18n.text({ title })}
    </Button>
  </div>
{/if}

{#if style === "action"}
  <ActionButton style="ghost" {...commonProps} {...props} variant="secondary">
    {@render icon()}
  </ActionButton>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem {...commonProps} {icon} style="flat">
    {i18n.text({ title })}
  </DropdownItem>
{/if}
