<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
</script>

<!-- TODO: refactor and extract components -->
<div class="trakt-mobile-navbar">
  <Link href="/" color="inherit">
    <div class="trakt-mobile-navbar-link">
      <svg
        width="22"
        height="18"
        viewBox="0 0 22 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.00684 7.78125C3.00684 7.22897 3.45455 6.78125 4.00684 6.78125H18.086C18.6382 6.78125 19.086 7.22897 19.086 7.78125V17.0036C19.086 17.5559 18.6382 18.0036 18.086 18.0036H14.0612C13.509 18.0036 13.0612 17.5559 13.0612 17.0036V13.9025C13.0612 13.3502 12.6135 12.9025 12.0612 12.9025H10.0316C9.47928 12.9025 9.03156 13.3502 9.03156 13.9025V17.0036C9.03156 17.5559 8.58385 18.0036 8.03156 18.0036H4.00684C3.45455 18.0036 3.00684 17.5559 3.00684 17.0036V7.78125Z"
          fill="currentColor"
        />
        <path
          d="M10.3273 0.611521C10.7087 0.264774 11.2913 0.264774 11.6727 0.611521L20.0861 8.26006C20.7624 8.8749 20.3274 10 19.4134 10H2.58661C1.67257 10 1.23761 8.8749 1.91393 8.26006L10.3273 0.611521Z"
          fill="currentColor"
        />
      </svg>

      <p class="meta-info">{m.navbar_link_home()}</p>
    </div>
  </Link>

  <Link href="/shows" color="inherit">
    <div class="trakt-mobile-navbar-link">
      <svg
        width="21"
        height="19"
        viewBox="0 0 21 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M14.143 0.706956C14.5336 0.316431 15.1667 0.316431 15.5573 0.706956C15.9478 1.09748 15.9478 1.73065 15.5573 2.12117L13.6786 3.99985H17.9004C19.5572 3.99985 20.9004 5.34299 20.9004 6.99985V15.9998C20.9004 17.6567 19.5572 18.9998 17.9004 18.9998H3.90039C2.24354 18.9998 0.900391 17.6567 0.900391 15.9998V6.99985C0.900391 5.34299 2.24354 3.99985 3.90039 3.99985H8.48618L6.6075 2.12117C6.21697 1.73065 6.21697 1.09748 6.6075 0.706956C6.99802 0.316431 7.63119 0.316431 8.02171 0.706956L11.0824 3.76762L14.143 0.706956Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M2.90039 8C2.90039 6.89543 3.79582 6 4.90039 6H12.9004C14.005 6 14.9004 6.89543 14.9004 8V15C14.9004 16.1046 14.005 17 12.9004 17H4.90039C3.79582 17 2.90039 16.1046 2.90039 15V8ZM16.9004 9C16.9004 8.44772 17.3481 8 17.9004 8C18.4527 8 18.9004 8.44772 18.9004 9C18.9004 9.55228 18.4527 10 17.9004 10C17.3481 10 16.9004 9.55228 16.9004 9ZM17.9004 11C17.3481 11 16.9004 11.4477 16.9004 12C16.9004 12.5523 17.3481 13 17.9004 13C18.4527 13 18.9004 12.5523 18.9004 12C18.9004 11.4477 18.4527 11 17.9004 11Z"
          fill="#212427"
        />
      </svg>
      <p class="meta-info">{m.navbar_link_movies()}</p>
    </div>
  </Link>

  <Link href="/movies" color="inherit">
    <div class="trakt-mobile-navbar-link">
      <svg
        width="20"
        height="19"
        viewBox="0 0 20 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.59961 10H13.5996C14.1519 10 14.5996 10.4477 14.5996 11V16C14.5996 16.5523 14.1519 17 13.5996 17H4.59961C4.04732 17 3.59961 16.5523 3.59961 16V10Z"
          fill="currentColor"
        />
        <path
          d="M15.5996 11.5C15.5996 11.1852 15.7478 10.8889 15.9996 10.7L17.9996 9.2C18.6588 8.70557 19.5996 9.17595 19.5996 10V17C19.5996 17.824 18.6588 18.2944 17.9996 17.8L15.9996 16.3C15.7478 16.1111 15.5996 15.8148 15.5996 15.5V11.5Z"
          fill="currentColor"
        />
        <path
          d="M0.599609 11.5C0.599609 10.6716 1.27118 10 2.09961 10H13.5996C14.1519 10 14.5996 10.4477 14.5996 11C14.5996 12.1046 13.7042 13 12.5996 13H2.09961C1.27118 13 0.599609 12.3284 0.599609 11.5Z"
          fill="currentColor"
        />
        <path
          d="M0.599609 4.5C0.599609 2.01472 2.61433 0 5.09961 0C7.58489 0 9.59961 2.01472 9.59961 4.5V9H5.09961C2.61433 9 0.599609 6.98528 0.599609 4.5Z"
          fill="currentColor"
        />
        <path
          d="M8.59961 4.5C8.59961 2.01472 10.6143 0 13.0996 0C15.5849 0 17.5996 2.01472 17.5996 4.5C17.5996 6.98528 15.5849 9 13.0996 9H8.59961V4.5Z"
          fill="currentColor"
        />
        <rect x="2.59961" y="2" width="5" height="5" rx="2.5" fill="#212427" />
        <rect x="10.5996" y="2" width="5" height="5" rx="2.5" fill="#212427" />
        <rect x="8" y="6" width="2" height="2" rx="1" fill="currentColor" />
      </svg>
      <p class="meta-info">{m.navbar_link_shows()}</p>
    </div>
  </Link>
</div>

<div class="trakt-mobile-navbar-spacer"></div>

<style>
  .trakt-mobile-navbar-spacer,
  .trakt-mobile-navbar {
    padding: var(--ni-16) 0;
    height: var(--ni-72);
    box-sizing: border-box;
  }

  .trakt-mobile-navbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background-color: var(--color-background-navbar);
    box-shadow: 0px -24px 64px 0px
      color-mix(in srgb, var(--color-shadow) 32%, transparent 68%);
    backdrop-filter: blur(8px);
    color: var(--color-foreground-navbar);
    display: flex;
    justify-content: center;
    gap: var(--ni-16);
  }

  .trakt-mobile-navbar-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-8);
    width: var(--ni-80);
  }

  :global(.trakt-link.trakt-link-active) {
    .trakt-mobile-navbar-link {
      color: var(--purple-200);
    }
  }
</style>
