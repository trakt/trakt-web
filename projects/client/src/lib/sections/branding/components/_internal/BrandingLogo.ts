import type { Component } from 'svelte';
import type { BrandingBackdrop } from '../../models/BrandingBackdrop.ts';

export type BrandingLogo = {
  key: string;
  name: string;
  label: string;
  artwork: Component;
  shape: 'wide' | 'square';
  look: 'plain' | 'branded' | 'mono';
  fixedBackdrop?: BrandingBackdrop;
};
