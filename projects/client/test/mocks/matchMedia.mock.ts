(globalThis as Record<string, unknown>).matchMedia = function () {
  return {
    matches: false,
    media: '',
    onchange: null,
    addEventListener: function () {},
    removeEventListener: function () {},
    dispatchEvent: function () {},
  };
};
