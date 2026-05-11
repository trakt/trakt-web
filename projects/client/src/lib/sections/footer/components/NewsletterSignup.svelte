<div class="trakt-newsletter">
  <span class="newsletter-label">WEEKLY CURATION (TBD)</span>
  <div class="newsletter-form">
    <input
      class="newsletter-input"
      type="email"
      placeholder="Your email"
      aria-label="Email for newsletter"
    />
    <button class="newsletter-submit" type="button" aria-label="Subscribe">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.33337 8H12.6667M12.6667 8L8.66671 4M12.6667 8L8.66671 12"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-newsletter {
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
    padding: var(--ni-20) var(--ni-24);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-m);
    background: var(--color-surface-elevated);
    min-width: var(--ni-200);
  }

  .newsletter-label {
    font-size: var(--ni-11);
    letter-spacing: 0.1em;
    color: var(--color-text-secondary);
  }

  .newsletter-form {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-s);
    padding: var(--ni-4) var(--ni-4) var(--ni-4) var(--ni-12);
  }

  .newsletter-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: var(--ni-13);
    color: var(--color-text-primary);
    min-width: 0;

    &::placeholder {
      color: var(--color-text-secondary);
    }
  }

  .newsletter-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--ni-32);
    height: var(--ni-32);
    border-radius: var(--border-radius-xs);
    background: var(--color-primary);
    border: none;
    cursor: pointer;
    color: var(--color-text-on-primary);
    flex-shrink: 0;
    transition: opacity 0.15s ease;

    &:hover {
      opacity: 0.85;
    }
  }
</style>
