import { describe, expect, it, vi } from 'vitest';
import type { MetaMessageDefinition } from '../../i18n/generator/model/MetaMessageDefinition.ts';
import { mapToTranslations } from './mapToTranslations.ts';

describe('mapToTranslations', () => {
  const messages: Record<string, MetaMessageDefinition> = {
    'hello': { default: 'Hello' },
    'goodbye': { default: 'Goodbye' },
    'welcome': { default: 'Welcome' },
  };

  const locales = ['es', 'fr'];

  it('should map translations correctly for multiple locales', () => {
    const response: Array<Record<string, Record<string, string>>> = [
      {
        'es': { 'hello': 'Hola', 'goodbye': 'Adiós', 'welcome': 'Bienvenido' },
        'fr': {
          'hello': 'Salut',
          'goodbye': 'Au revoir',
          'welcome': 'Bienvenue',
        },
      },
    ];

    const result = mapToTranslations({ messages, locales, response });

    expect(result).toEqual({
      'es': {
        'hello': 'Hola',
        'goodbye': 'Adiós',
        'welcome': 'Bienvenido',
      },
      'fr': {
        'hello': 'Salut',
        'goodbye': 'Au revoir',
        'welcome': 'Bienvenue',
      },
    });
  });

  it('should aggregate translations for multiple locales', () => {
    const response: Array<Record<string, Record<string, string>>> = [
      {
        'es': { 'hello': 'Hola' },
        'fr': { 'hello': 'Salut' },
      },
      {
        'es': { 'goodbye': 'Adiós' },
        'fr': { 'goodbye': 'Au revoir' },
      },
      {
        'es': { 'welcome': 'Bienvenido' },
        'fr': { 'welcome': 'Bienvenue' },
      },
    ];

    const result = mapToTranslations({ messages, locales, response });

    expect(result).toEqual({
      'es': {
        'hello': 'Hola',
        'goodbye': 'Adiós',
        'welcome': 'Bienvenido',
      },
      'fr': {
        'hello': 'Salut',
        'goodbye': 'Au revoir',
        'welcome': 'Bienvenue',
      },
    });
  });

  it('should map translations correctly for single key', () => {
    const singleKeyMessages: Record<string, MetaMessageDefinition> = {
      'hello': { default: 'Hello' },
    };
    const response: Array<Record<string, Record<string, string>>> = [
      {
        'es': { 'hello': 'Hola' },
        'fr': { 'hello': 'Salut' },
      },
    ];

    const result = mapToTranslations({
      messages: singleKeyMessages,
      locales,
      response,
    });

    expect(result).toEqual({
      'es': {
        'hello': 'Hola',
      },
      'fr': {
        'hello': 'Salut',
      },
    });
  });

  it('should handle missing translations by using default values', () => {
    const response: Array<Record<string, Record<string, string>>> = [
      {
        'es': { 'hello': 'Hola' },
        'fr': { 'hello': 'Bonjour' },
      },
      {
        'es': { 'goodbye': 'Adiós' },
        'fr': {},
      },
      {
        'es': { 'welcome': 'Bienvenido' },
        'fr': {},
      },
    ];

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = mapToTranslations({
      messages,
      locales,
      response,
    });

    expect(result).toEqual({
      'es': {
        'hello': 'Hola',
        'goodbye': 'Adiós',
        'welcome': 'Bienvenido',
      },
      'fr': {
        'hello': 'Bonjour',
        'goodbye': 'Goodbye',
        'welcome': 'Welcome',
      },
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      '⚠️ Missing 2 keys for fr: goodbye, welcome',
    );

    consoleSpy.mockRestore();
  });

  it('should handle missing locale in response', () => {
    const response: Array<Record<string, Record<string, string>>> = [
      {
        'es': { 'hello': 'Hola' },
      },
      {
        'es': { 'goodbye': 'Adiós' },
      },
      {
        'es': { 'welcome': 'Bienvenido' },
      },
    ];

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = mapToTranslations({
      messages,
      locales,
      response,
    });

    expect(result).toEqual({
      'es': {
        'hello': 'Hola',
        'goodbye': 'Adiós',
        'welcome': 'Bienvenido',
      },
      'fr': {
        'hello': 'Hello',
        'goodbye': 'Goodbye',
        'welcome': 'Welcome',
      },
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      '⚠️ Missing translations for locale: fr',
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      '⚠️ Missing 3 keys for fr: hello, goodbye, welcome',
    );

    consoleSpy.mockRestore();
  });
});
