import z from "npm:zod";

export const zeroToSixSchema = z
  .literal(0)
  .or(z.literal(1))
  .or(z.literal(2))
  .or(z.literal(3))
  .or(z.literal(4))
  .or(z.literal(5))
  .or(z.literal(6));

export type zeroToSixLiteral = z.infer<typeof zeroToSixSchema>;
const timeObjectSchema = z
  .object({
    startTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
  })
  .array();
export const availabilityPreferencesSchema = z.object({
  0: timeObjectSchema,
  1: timeObjectSchema,
  2: timeObjectSchema,
  3: timeObjectSchema,
  4: timeObjectSchema,
  5: timeObjectSchema,
  6: timeObjectSchema,
});

export type AvailabilityPreferences = z.infer<
  typeof availabilityPreferencesSchema
>;
