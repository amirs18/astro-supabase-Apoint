import React from "react";
import type { Json } from "../../lib/database.types";
import { useForm, type SubmitHandler } from "react-hook-form";
import { supabase } from "../../lib/supabase";
import { z } from "zod";

type FormInput = {
  bio: string;
  email: string;
  id: number;
  // location_geoJSON: Json;
  location_name: string;
  name: string;
  phone_number: string;
  photo_link: string;
};
type PropTypes = {
  providerData?: FormInput | undefined;
};

const geometrySchema = z
  .object({
    type: z.literal("Feature"),
    properties: z.object({}),
    geometry: z.object({
      coordinates: z.number().array(),
      type: z.literal("Point"),
    }),
  })
  .nullable();

const phoneRegex = new RegExp(
  /([0-9\s\-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
);
const providerSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  bio: z.string().nullable().default(null),
  // location_geoJSON: geometrySchema,
  location_name: z.string().nullable().default(null),
  phone_number: z
    .string()
    .regex(phoneRegex, "Invalid Phone Number!")
    .nullable()
    .default(null),
  photo_link: z.string().nullable().default(null),
});

export function ProviderForm({ providerData }: PropTypes) {
  const { register, handleSubmit, reset, setError } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = async (formData) => {
    const sParse = providerSchema.safeParse(formData);
    if (sParse.error) {
      const err = sParse.error;
      err.errors.forEach((e) => {
        setError(e.path[0] as keyof FormInput, { message: e.message });
      });
    } else {
      console.log(
        "🚀 ~ constonSubmit:SubmitHandler<FormInput>= ~ sParse.data:",
        sParse.data,
      );
      const { data, error } = await supabase
        .from("providers")
        .insert(sParse.data)
        .select()
        .single();

      if (error) {
        console.log(
          "🚀 ~ constonSubmit:SubmitHandler<FormInput>= ~ error:",
          error,
        );
        //TODO: handle error
      } else {
        window.location.replace(`/provider/${data.id}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("id")}
        className="input input-bordered flex items-center gap-2"
        type="hidden"
        name="id"
        value={providerData?.id}
      />
      <label>Name:</label>
      <input
        {...register("name")}
        className="input input-bordered flex items-center gap-2"
        type="text"
        id="name"
        name="name"
        value={providerData?.name}
        required
      />


      <label>Email:</label>
      <input
        {...register("email")}
        className="input input-bordered flex items-center gap-2"
        type="email"
        id="email"
        name="email"
        value={providerData?.email}
        required
      />

      <label>Phone Number:</label>
      <input
        {...register("phone_number",{pattern:})}
        className="input input-bordered flex items-center gap-2"
        type="tel"
        id="phone_number"
        name="phone_number"
        value={providerData && providerData.phone_number}
      />
      <label>Bio:</label>

      <input
        {...register("bio")}
        className="textarea textarea-bordered flex items-center gap-2"
        id="bio"
        name="bio"
        value={providerData?.bio}
      />
      <label>location_name:</label>
      <input
        {...register("location_name")}
        className="input input-bordered flex items-center gap-2"
        type="text"
        id="location_name"
        name="location_name"
        value={providerData?.location_name}
      />
      {/* <input
        {...register("location_geoJSON")}
        className="input input-bordered flex items-center gap-2"
        type="text"
        id="location_geoJSON"
        name="location_geoJSON"
        value={providerData?.location_geoJSON?.toString()} //TODO create a geoJson converter to string and show on map
      /> */}
      <label>photo_link</label>
      <input
        {...register("photo_link")}
        className="input input-bordered flex items-center gap-2"
        type="url"
        id="photo_link"
        name="photo_link"
        value={providerData?.photo_link}
      />

      <button className="btn" type="submit">
        Update Provider
      </button>
    </form>
  );
}
