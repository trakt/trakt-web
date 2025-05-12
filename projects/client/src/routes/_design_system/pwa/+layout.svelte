<script lang="ts">
  import { page } from "$app/state";

  const { children } = $props();
</script>

<div class="trakt-pwa-simulator">
  <div class="trakt-pwa-simulator-controls">
    <h5>PWA Simulator</h5>
    <nav>
      <a
        href="/_design_system/pwa/android"
        class:active={page.url.pathname.includes("/android")}
      >
        Android
      </a>
      <a
        href="/_design_system/pwa/ios"
        class:active={page.url.pathname.includes("/ios")}
      >
        iOS
      </a>
    </nav>
  </div>

  <div class="trakt-simulator-content">
    {@render children()}
  </div>
</div>

<style>
  .trakt-pwa-simulator {
    display: flex;
    flex-direction: column;
    height: 100vh;

    color: var(--shade-10);
    background-color: var(--shade-700);
  }

  .trakt-pwa-simulator-controls {
    padding: var(--ni-16);
    background-color: var(--shade-900);
    border-bottom: 1px solid var(--shade-600);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  nav {
    display: flex;
    gap: var(--ni-8);
  }

  a {
    padding: var(--ni-8) var(--ni-16);
    border-radius: var(--border-radius-l);
    background-color: var(--shade-50);
    color: var(--shade-900);
    transition: background-color var(--transition-increment);
  }

  a:hover {
    color: var(--shade-100);
    background-color: var(--purple-500);
  }

  a.active {
    background-color: var(--purple-700);
    color: var(--shade-10);
  }

  .trakt-simulator-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
</style>
