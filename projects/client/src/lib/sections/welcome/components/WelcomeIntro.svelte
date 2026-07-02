<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import PopcornIcon from "$lib/components/icons/PopcornIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const { user } = useUser();

  const displayName = $derived(
    $user?.username ? toDisplayableName($user) : null,
  );

  const heading = $derived(
    displayName != null
      ? m.welcome_greeting({ name: displayName })
      : m.welcome_greeting_generic(),
  );
</script>

<section class="trakt-welcome-intro">
  <h1 class="welcome-intro-heading">{heading}</h1>
  <p class="secondary welcome-intro-description">{m.welcome_intro()}</p>

  <div class="welcome-intro-actions">
    <Button
      href={UrlBuilder.home()}
      color="purple"
      variant="primary"
      style="flat"
      size="small"
      label={m.welcome_get_started()}
    >
      {m.welcome_get_started()}
      {#snippet icon()}
        <PopcornIcon />
      {/snippet}
    </Button>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-welcome-intro {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-l);

    max-width: var(--ni-768);
    margin: 0 auto;

    padding-block: var(--gap-xxl);

    text-align: center;

    @include for-mobile {
      padding-inline: var(--gap-m);
    }
  }

  .welcome-intro-heading {
    font-size: var(--ni-32);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;

    transition: font-size var(--transition-increment) ease-in-out;

    @include for-mobile {
      font-size: var(--ni-28);
    }
  }

  .welcome-intro-description {
    font-size: var(--ni-18);
    line-height: 1.7;

    max-width: var(--ni-640);

    @include for-mobile {
      font-size: var(--font-size-text);
    }
  }

  .welcome-intro-actions {
    display: flex;
    justify-content: center;

    margin-block-start: var(--gap-s);
  }
</style>
