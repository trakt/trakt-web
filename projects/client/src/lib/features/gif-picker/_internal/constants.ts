// Klipy caps `per_page` well above this; a screenful plus a little headroom
// keeps the first paint cheap and the scroll sentinel busy.
export const GIF_PAGE_SIZE = 24;

// Long enough that a touch keyboard's inter-key gap does not fire a request
// per character, short enough to feel live. Matches the media search debounce.
export const GIF_SEARCH_DEBOUNCE = 250;
