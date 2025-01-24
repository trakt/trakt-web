import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { zodToHash } from './zodToHash';

describe('zodToHash', () => {
  it('should generate consistent hash for same schema', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const hash1 = zodToHash(schema);
    const hash2 = zodToHash(schema);

    expect(hash1).toBe(hash2);
  });

  it('should generate different hashes for different schemas', () => {
    const schema1 = z.object({
      name: z.string(),
    });

    const schema2 = z.object({
      age: z.number(),
    });

    const hash1 = zodToHash(schema1);
    const hash2 = zodToHash(schema2);

    expect(hash1).not.toBe(hash2);
  });

  it('should handle nested schemas', () => {
    const addressSchema = z.object({
      street: z.string(),
      city: z.string(),
    });

    const personSchema = z.object({
      name: z.string(),
      address: addressSchema,
    });

    const hash1 = zodToHash(personSchema);
    const hash2 = zodToHash(personSchema);

    expect(hash1).toBe(hash2);
  });

  it('should handle arrays and optional fields', () => {
    const schema = z.object({
      tags: z.array(z.string()),
      optional: z.number().optional(),
      nullableField: z.string().nullable(),
    });

    const hash1 = zodToHash(schema);
    const hash2 = zodToHash(schema);

    expect(hash1).toBe(hash2);
  });

  it('should handle unions and literals', () => {
    const schema = z.object({
      status: z.union([z.literal('active'), z.literal('inactive')]),
      type: z.enum(['user', 'admin', 'guest']),
    });

    const hash1 = zodToHash(schema);
    const hash2 = zodToHash(schema);

    expect(hash1).toBe(hash2);
  });

  it('should handle recursive schemas', () => {
    const nodeSchema: z.ZodType<unknown> = z.lazy(() =>
      z.object({
        value: z.string(),
        children: z.array(nodeSchema),
      })
    );

    const hash1 = zodToHash(nodeSchema);
    const hash2 = zodToHash(nodeSchema);

    expect(hash1).toBe(hash2);
  });

  it('should handle complex nested schema with multiple data types', () => {
    const nestedSchema = z.object({
      primitive: z.string(),
      numbers: z.object({
        int: z.number().int(),
        float: z.number(),
        positive: z.number().positive(),
      }),
      arrays: z.array(z.object({
        id: z.number(),
        tags: z.array(z.string()),
      })),
      optional: z.object({
        maybe: z.string().optional(),
        nullable: z.boolean().nullable(),
        defaulted: z.number().default(42),
      }),
      unions: z.union([
        z.object({ type: z.literal('a'), value: z.string() }),
        z.object({ type: z.literal('b'), count: z.number() }),
      ]),
      enums: z.enum(['one', 'two', 'three']),
      record: z.record(z.string(), z.any()),
      tuple: z.tuple([z.string(), z.number(), z.boolean()]),
    });

    const hash1 = zodToHash(nestedSchema);
    const hash2 = zodToHash(nestedSchema);

    expect(hash1).toBe(hash2);
  });
});
