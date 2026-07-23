/**
 * A display-filter toggle (e.g. Watched, Watchlisted) is tri-state in the URL:
 * the param is absent (Default), `"true"`, or `"false"`. This maps between that
 * raw param value and the three-position segmented control, honoring the
 * filter's `isInverted` flag so the user-facing On/Off match the label.
 */
export type ToggleFilterState = 'default' | 'on' | 'off';

type FromValueProps = {
  value: string | Nil;
  isInverted: boolean;
};

type ToValueProps = {
  state: string;
  isInverted: boolean;
};

export const toggleFilterState = {
  fromValue: ({ value, isInverted }: FromValueProps): ToggleFilterState => {
    if (value == null) return 'default';

    const isOn = isInverted ? value !== 'true' : value === 'true';
    return isOn ? 'on' : 'off';
  },
  toValue: ({ state, isInverted }: ToValueProps): string | null => {
    if (state !== 'on' && state !== 'off') return null;

    const isOn = state === 'on';
    return (isInverted ? !isOn : isOn) ? 'true' : 'false';
  },
};
