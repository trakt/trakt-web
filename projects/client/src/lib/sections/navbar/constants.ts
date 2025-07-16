import type { DeviceProps } from '../../guards/_internal/DeviceProps.ts';

type NavbarType = 'top' | 'side';

export const NAVBAR_CONFIG: Record<NavbarType, DeviceProps> = {
  top: { device: ['mobile', 'tablet-sm'] as const },
  side: { device: ['desktop', 'tablet-lg'] as const },
} as const;
