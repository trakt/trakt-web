/**
 * Meta messages structure containing locale information and messages
 */

import type { MetaMessageDefinition } from './MetaMessageDefinition.ts';

export interface MetaMessages {
  $schema?: string;
  meta: {
    locale: string;
    fallbackLocale?: string;
    direction?: 'ltr' | 'rtl';
    generator?: {
      inlang?: {
        enabled: boolean;
        outputPath: string;
      };
      android?: {
        enabled: boolean;
        outputPath: string;
        resourceName: string;
      };
      ios?: {
        enabled: boolean;
        outputPath: string;
      };
    };
  };
  messages: Record<string, MetaMessageDefinition>;
}
