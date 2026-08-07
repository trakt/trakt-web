<script lang="ts">
  /*
    The one uppercase label style in the revamped header. Section headers, field
    labels and score-source labels all render through here, so there is exactly
    one place that owns the tracking, weight and colour - the original header
    drifted because every block styled its own label.

    `--summary-header-label-tracking` lets a caller widen the tracking (the
    masthead kicker sits looser than a field label) without forking the style.
  */
  const { text }: { text: string } = $props();
</script>

<span class="trakt-summary-header-label">{text}</span>

<style lang="scss">
  .trakt-summary-header-label {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: var(--summary-header-label-tracking, 0.13em);
    text-transform: uppercase;

    color: var(--summary-header-label-color, var(--color-text-secondary));

    white-space: nowrap;
  }
</style>
