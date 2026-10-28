/*
  Milliseconds rather than the `--transition-*` tokens: this is a JS timer, and
  a custom property cannot reach it. The gap is what makes the reveal read as
  an order rather than a simultaneous fade, and it has to OUTLAST the poster
  placeholder's own 300ms dissolve - at any less the band starts moving while
  the poster is still arriving, and the two read as one event again.
*/
const POSTER_LEAD_MS = 340;

/*
  A ceiling on how long the artwork will wait for the chrome to get out of the
  way. The hold is meant to absorb an exit animation, which is measured in
  a couple of hundred milliseconds; anything past this is a page that is never
  going to hide its navbar, and a band that never appears is far worse than
  one that overlaps a toggle for a frame.
*/
const CHROME_HOLD_CAP_MS = 900;

export type ArtRevealStage = 'idle' | 'poster' | 'art';

type StagedArtRevealProps = {
  sources: () => Array<string | Nil>;
  /**
   * Holds the ARTWORK back while true - the images still load, they just do
   * not show. The masthead passes the navbar's presence through here so the
   * band waits for the toggle row to finish leaving instead of fading in
   * underneath it.
   */
  isHeld?: () => boolean;
};

/**
 * Holds the masthead's poster and its backdrop behind one curtain, then lifts
 * it in order: the poster first, the artwork a beat later.
 *
 * Both wait for BOTH. Revealing each as it happens to arrive puts the order at
 * the mercy of two unrelated downloads - the band would sometimes paint before
 * the poster it sits behind, which is the one order that looks broken. Waiting
 * costs the slower of the two, which is the wait either way.
 *
 * A failed image settles like a loaded one. The alternative is a placeholder
 * that never leaves, and a broken image is the image's to report.
 *
 * `isHeld` adds a third thing the reveal waits on, without delaying either
 * download: on a route that hides the navbar, NOTHING is shown until the
 * toggle row has actually left the screen - it passes over the poster's space
 * on its way out, so a poster revealed early lands underneath it.
 */
export function useStagedArtReveal(
  { sources, isHeld }: StagedArtRevealProps,
) {
  let hasImages = $state(false);
  let hasLead = $state(false);
  let isCapped = $state(false);

  /*
    Derived rather than assigned, so the hold can LIFT: the chrome finishing
    its exit has to advance the stage on its own, and a stage written once by
    a timer could not answer to anything that happened afterwards.
  */
  const stage = $derived.by<ArtRevealStage>(() => {
    /*
      The hold gates the WHOLE reveal, not just the band. Holding only the
      artwork still let the poster appear under a toggle row that was part way
      through sliding off it - the row passes over the poster's space on its
      way out, so anything revealed there lands underneath it.
    */
    const isWaitingOnChrome = Boolean(isHeld?.()) && !isCapped;

    if (!hasImages || isWaitingOnChrome) return 'idle';
    if (!hasLead) return 'poster';
    return 'art';
  });

  $effect(() => {
    const urls = sources().filter((url): url is string => Boolean(url));

    let isCurrent = true;
    hasImages = false;
    hasLead = false;
    isCapped = false;

    /* Nothing to wait for - anything else would hold an empty curtain up. */
    if (urls.length === 0) {
      hasImages = true;
      hasLead = true;
      isCapped = true;
      return;
    }

    const settle = (url: string) =>
      new Promise<void>((resolve) => {
        const image = new Image();
        image.onload = () => resolve();
        image.onerror = () => resolve();
        image.src = url;

        /*
         * A cached image can be complete before the handlers are attached, in
         * which case neither ever fires.
         */
        if (image.complete) resolve();
      });

    let leadTimer: ReturnType<typeof setTimeout> | undefined;
    let capTimer: ReturnType<typeof setTimeout> | undefined;

    Promise.all(urls.map(settle)).then(() => {
      if (!isCurrent) return;

      hasImages = true;
      leadTimer = setTimeout(() => {
        if (isCurrent) hasLead = true;
      }, POSTER_LEAD_MS);
      capTimer = setTimeout(() => {
        if (isCurrent) isCapped = true;
      }, CHROME_HOLD_CAP_MS);
    });

    return () => {
      isCurrent = false;
      clearTimeout(leadTimer);
      clearTimeout(capTimer);
    };
  });

  return {
    get stage() {
      return stage;
    },
    get isPosterRevealed() {
      return stage !== 'idle';
    },
    get isArtRevealed() {
      return stage === 'art';
    },
  };
}
