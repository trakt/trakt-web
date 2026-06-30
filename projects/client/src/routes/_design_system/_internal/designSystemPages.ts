export type DesignSystemPage = {
  title: string;
  href: string;
  description: string;
  kind: 'Foundation' | 'Component' | 'Formatting' | 'PWA';
};

export type DesignSystemGroup = {
  id: string;
  title: string;
  description: string;
  pages: DesignSystemPage[];
};

export const DESIGN_SYSTEM_GROUPS: DesignSystemGroup[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    description:
      'Global assets, color tokens, typography, and iconography that every UI surface builds on.',
    pages: [
      {
        title: 'Colors',
        href: '/_design_system/colors',
        description: 'Palette scales and semantic color tokens.',
        kind: 'Foundation',
      },
      {
        title: 'Icons',
        href: '/_design_system/icons',
        description: 'All app icon components in one inventory.',
        kind: 'Foundation',
      },
      {
        title: 'Typography',
        href: '/_design_system/typography',
        description: 'Font stacks, type tokens, utilities, and usage patterns.',
        kind: 'Foundation',
      },
    ],
  },
  {
    id: 'components',
    title: 'Components',
    description:
      'Reusable controls and feedback surfaces shown with realistic states and content.',
    pages: [
      {
        title: 'Items',
        href: '/_design_system/items',
        description:
          'Movie, show, user, and person row, grid, and list presentations.',
        kind: 'Component',
      },
      {
        title: 'Buttons',
        href: '/_design_system/buttons',
        description:
          'Button styles, colors, variants, icons, and disabled states.',
        kind: 'Component',
      },
      {
        title: 'Charts',
        href: '/_design_system/charts',
        description:
          'Data-viz primitives, distribution-bar + KPI-tile bases, and the shared VizPoint contract.',
        kind: 'Component',
      },
      {
        title: 'Drawers',
        href: '/_design_system/drawers',
        description: 'Drawer sizes, overlay headers, and VIP variants.',
        kind: 'Component',
      },
      {
        title: 'Dropdown',
        href: '/_design_system/dropdown',
        description: 'Dropdown list colors, styles, variants, and item states.',
        kind: 'Component',
      },
      {
        title: 'Links',
        href: '/_design_system/links',
        description: 'Inline and navigational link styling.',
        kind: 'Component',
      },
      {
        title: 'Share Card',
        href: '/_design_system/share-card',
        description: 'Share-card layouts for social previews and exports.',
        kind: 'Component',
      },
      {
        title: 'Snackbar',
        href: '/_design_system/snackbar',
        description: 'Default and anchored snackbar examples.',
        kind: 'Component',
      },
      {
        title: 'Toggles',
        href: '/_design_system/toggles',
        description:
          'Switches, media toggles, header actions, and row toggles.',
        kind: 'Component',
      },
    ],
  },
  {
    id: 'formatting',
    title: 'Formatting',
    description:
      'Localized formatting examples for data that appears throughout product surfaces.',
    pages: [
      {
        title: 'Dates',
        href: '/_design_system/formatting/dates',
        description: 'Date and relative-time formatting examples.',
        kind: 'Formatting',
      },
      {
        title: 'Numbers',
        href: '/_design_system/formatting/numbers',
        description: 'Number, compact-number, and rating formatting examples.',
        kind: 'Formatting',
      },
    ],
  },
  {
    id: 'pwa',
    title: 'PWA',
    description:
      'Install and platform simulator views for progressive web app surfaces.',
    pages: [
      {
        title: 'Android',
        href: '/_design_system/pwa/android',
        description: 'Android install and splash-screen simulator.',
        kind: 'PWA',
      },
      {
        title: 'iOS',
        href: '/_design_system/pwa/ios',
        description: 'iOS install and splash-screen simulator.',
        kind: 'PWA',
      },
    ],
  },
];

export const DESIGN_SYSTEM_PAGES = DESIGN_SYSTEM_GROUPS.flatMap((group) =>
  group.pages
);

export const findDesignSystemPage = (pathname: string) =>
  DESIGN_SYSTEM_PAGES.find((page) => page.href === pathname);
