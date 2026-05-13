<script lang="ts"></script>

<div class="where-to-watch-item">
  <div class="where-to-watch-item-content" data-variant="service">
    <span class="sad-face" aria-hidden="true">😢</span>
    <p class="empty-text">
      <span>No Services</span>
      <span>Available</span>
    </p>
  </div>
</div>

<style>
  .where-to-watch-item {
    :global(.trakt-link) {
      text-decoration: none;
      color: var(--color-text-secondary);

      &:hover {
        color: var(--color-text-secondary);
      }
    }
  }

  .where-to-watch-item-content {
    flex-shrink: 0;

    box-shadow: var(--shadow-base);

    width: var(--width-where-to-watch-item);
    height: var(--height-where-to-watch-item);

    padding: var(--ni-18) var(--ni-16) var(--ni-14);
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap-s);

    background-color: var(--color-card-background);
    border-radius: var(--border-radius-m);

    p {
      text-align: center;
      flex-shrink: 0;
      min-height: var(--ni-18);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--gap-1);

      span:first-child {
        white-space: nowrap;
        font-size: var(--ni-14);
      }

      span:last-child {
        font-size: var(--ni-14);
      }
    }

    &[data-variant="service"] {
      overflow: hidden;

      p {
        flex-grow: 1;
      }
    }
  }

  .sad-face {
    color: var(--color-text-secondary);
    font-size: var(--ni-32);
    line-height: var(--ni-24);
  }
</style>
