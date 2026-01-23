import { z } from 'zod';

export const areaIdSchema = z.string().uuid();
export const userIdSchema = z.string().uuid();

export const areaCreateSchema = z.object({
  userId: userIdSchema,
  name: z.string().min(1),
  notes: z.string().optional(),
  geojson: z.unknown(),
});

export const areaUpdateSchema = z
  .object({
    name: z.string().min(1).optional(),
    notes: z.string().optional(),
    geojson: z.unknown().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required.',
  });
