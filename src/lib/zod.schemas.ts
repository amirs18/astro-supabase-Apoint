import z from "zod";

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

const phoneRegex = new RegExp(
  /([0-9\s\-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
);
const pointRegex = new RegExp(/^POINT\(-?\d+\.\d+ \-?\d+\.\d+\)$/);
export const providerSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  bio: z.string().nullable().default(null),
  location: z.string().regex(pointRegex, "invalid Point input").or(z.literal('')),
  location_name: z.string().nullable().default(null),
  phone_number: z
    .string()
    .regex(phoneRegex, "Invalid Phone Number!")
    .nullable()
    .default(null),
  photo_link: z.string().nullable().default(null),
});
export const providerWithAvailabilityPreferencesSchema = providerSchema.extend({
  availability_preferences: availabilityPreferencesSchema.optional(),
});
