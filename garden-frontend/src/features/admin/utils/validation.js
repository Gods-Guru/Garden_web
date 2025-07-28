import { z } from 'zod';

export const gardenSchema = z.object({
  name: z.string().min(3, 'Garden name must be at least 3 characters'),
  description: z.string().optional(),
  address: z.string().min(5, 'Please enter a valid address'),
  size: z.number().positive('Size must be a positive number'),
  plotCount: z.number().int().positive('Plot count must be a positive number'),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  rules: z.string().optional(),
  photos: z.array(z.string()).optional(),
  managers: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'maintenance']).default('active'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const validateGarden = (data) => {
  try {
    return { data: gardenSchema.parse(data), errors: null };
  } catch (error) {
    return { data: null, errors: error.errors };
  }
};
