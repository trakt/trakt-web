const state = {
  marker: new Date().setHours(0, 0, 0, 0),
} as { marker: Nil | string | number };

export const setMarker = () => {
  state.marker = new Date().getTime();
};

export const getMarker = () => {
  return state.marker;
};
