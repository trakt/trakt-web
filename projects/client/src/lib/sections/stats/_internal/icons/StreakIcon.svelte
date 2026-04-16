<script lang="ts">
  // FIXME: add more states
  const { count }: { count: number } = $props();

  type GradientStop = { offset?: string; color: string };

  const uniqueId = crypto.randomUUID();
</script>

{#snippet flame(
  fillStops: GradientStop[],
  strokeStops: GradientStop[],
  strokeTransform = "translate(24 -5) rotate(90) scale(28.5 38.6786)",
)}
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 29C18.3261 29 19.5979 28.4732 20.5355 27.5355C21.4732 26.5979 22 25.3261 22 24C22 21.24 21 20 20 18C17.856 13.714 19.552 9.892 24 6C25 11 28 15.8 32 19C36 22.2 38 26 38 30C38 31.8385 37.6379 33.659 36.9343 35.3576C36.2307 37.0561 35.1995 38.5995 33.8995 39.8995C32.5995 41.1995 31.0561 42.2307 29.3576 42.9343C27.659 43.6379 25.8385 44 24 44C22.1615 44 20.341 43.6379 18.6424 42.9343C16.9439 42.2307 15.4005 41.1995 14.1005 39.8995C12.8005 38.5995 11.7693 37.0561 11.0657 35.3576C10.3621 33.659 10 31.8385 10 30C10 27.694 10.866 25.412 12 24C12 25.3261 12.5268 26.5979 13.4645 27.5355C14.4021 28.4732 15.6739 29 17 29Z"
      fill="url(#fill-{uniqueId})"
      stroke="url(#stroke-{uniqueId})"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <defs>
      <radialGradient
        id="fill-{uniqueId}"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(38 -48) rotate(90) scale(95.5 129.607)"
      >
        {#each fillStops as stop (stop.color)}
          <stop offset={stop.offset} stop-color={stop.color} />
        {/each}
      </radialGradient>
      <radialGradient
        id="stroke-{uniqueId}"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform={strokeTransform}
      >
        {#each strokeStops as stop (stop.color)}
          <stop offset={stop.offset} stop-color={stop.color} />
        {/each}
      </radialGradient>
    </defs>
  </svg>
{/snippet}

{#if count === 0}
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 29C18.3261 29 19.5979 28.4732 20.5355 27.5355C21.4732 26.5979 22 25.3261 22 24C22 21.24 21 20 20 18C17.856 13.714 19.552 9.892 24 6C25 11 28 15.8 32 19C36 22.2 38 26 38 30C38 31.8385 37.6379 33.659 36.9343 35.3576C36.2307 37.0561 35.1995 38.5995 33.8995 39.8995C32.5995 41.1995 31.0561 42.2307 29.3576 42.9343C27.659 43.6379 25.8385 44 24 44C22.1615 44 20.341 43.6379 18.6424 42.9343C16.9439 42.2307 15.4005 41.1995 14.1005 39.8995C12.8005 38.5995 11.7693 37.0561 11.0657 35.3576C10.3621 33.659 10 31.8385 10 30C10 27.694 10.866 25.412 12 24C12 25.3261 12.5268 26.5979 13.4645 27.5355C14.4021 28.4732 15.6739 29 17 29Z"
      stroke="#605365"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
{:else if count <= 1}
  {@render flame(
    [
      { offset: "0.701923", color: "#3D4348" },
      { offset: "1", color: "#605365" },
    ],
    [{ color: "#2E3337" }, { offset: "1", color: "#99A1AF" }],
  )}
{:else if count <= 7}
  {@render flame(
    [{ color: "#A855F7" }, { offset: "1", color: "#633291" }],
    [{ color: "#633291" }, { offset: "1", color: "#A855F7" }],
  )}
{:else}
  {@render flame(
    [
      { offset: "0.552885", color: "#240046" },
      { offset: "1", color: "#5700AA" },
    ],
    [
      { offset: "0.355769", color: "#BD85F2" },
      { offset: "1", color: "#8F19FF" },
    ],
    "translate(24.25 2) rotate(79.0459) scale(31.5753 42.8522)",
  )}
{/if}
