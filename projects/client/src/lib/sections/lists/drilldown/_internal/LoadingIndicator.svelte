<script>
  import { fade } from "svelte/transition";
</script>

<div class="loading-indicator" out:fade={{ duration: 150 }}>
  <div class="spinner"></div>
</div>

<style>
  .loading-indicator {
    display: flex;
    justify-content: center;
  }

  .spinner {
    width: var(--ni-56);
    height: var(--ni-56);
    border: var(--ni-16) solid;

    box-sizing: border-box;
    border-radius: 50%;
    border-color: var(--purple-100);
    border-right-color: var(--purple-500);

    animation: spin 1s infinite linear;
  }

  @keyframes spin {
    to {
      transform: rotate(1turn);
    }
  }
</style>
