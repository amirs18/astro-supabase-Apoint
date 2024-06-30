import React, { useState } from "react";
import type { Json } from "../../lib/database.types";
import { useForm, type SubmitHandler } from "react-hook-form";
import { type Database } from "../../lib/database.types";
import { z } from "zod";
import { AuthHelper } from "./AuthHelper";
import axios from "axios";

type providerResponse = Database["public"]["Tables"]["providers"]["Row"];

type FormInput = {
  bio: string | null;
  email: string;
  id: number;
  location_geoJSON: Json;
  location_name: string | null;
  name: string;
  phone_number: string | null;
  photo_link: string | null;
};
type PropTypes = {
  providerData?: FormInput;
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
  const { register, handleSubmit } = useForm<FormInput>();
  const [errors, setErrors] = useState<string[]>([]);

  const onSubmit: SubmitHandler<FormInput> = async (formData: FormInput) => {
    const sParse = providerSchema.safeParse(formData);
    if (sParse.error) {
      const err = sParse.error;
      setErrors(err.errors.map((e) => e.path[0] + ": " + e.message));
    } else {
      const { data, status } = providerData?.id
        ? await axios.patch("/api/provider", {
            ...sParse.data,
            id: providerData.id,
          })
        : await axios.post<providerResponse>(`/api/provider`, sParse.data);

      if (status !== 200) {
        console.log(
          "🚀 ~ constonSubmit:SubmitHandler<FormInput>= ~ error:",
          data,
        );
        //TODO: handle error
      } else {
        window.location.href = `/provider/${data.id}`;
      }
    }
  };

  return (
    <AuthHelper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("id")}
          className="input input-bordered flex items-center gap-2"
          type="hidden"
          name="id"
          defaultValue={providerData?.id.toString() || ""}
        />
        <label>Name:</label>
        <input
          {...register("name")}
          className="input input-bordered flex items-center gap-2"
          type="text"
          id="name"
          name="name"
          defaultValue={providerData?.name || ""}
          required
        />

        <label>Email:</label>
        <input
          {...register("email")}
          className="input input-bordered flex items-center gap-2"
          type="email"
          id="email"
          name="email"
          defaultValue={providerData?.email || ""}
          required
        />

        <label>Phone Number:</label>
        <input
          {...register("phone_number")}
          className="input input-bordered flex items-center gap-2"
          type="tel"
          id="phone_number"
          name="phone_number"
          defaultValue={providerData?.phone_number || ""}
        />
        <label>Bio:</label>

        <input
          {...register("bio")}
          className="textarea textarea-bordered flex items-center gap-2"
          id="bio"
          name="bio"
          defaultValue={providerData?.bio || ""}
        />
        <label>location_name:</label>
        <input
          {...register("location_name")}
          className="input input-bordered flex items-center gap-2"
          type="text"
          id="location_name"
          name="location_name"
          defaultValue={providerData?.location_name || ""}
        />
        {/* <input
        {...register("location_geoJSON")}
        className="input input-bordered flex items-center gap-2"
        type="text"
        id="location_geoJSON"
        name="location_geoJSON"
        defaultValue={providerData?.location_geoJSON?.toString()} //TODO create a geoJson converter to string and show on map
        /> */}
        <label>photo_link</label>
        <input
          {...register("photo_link")}
          className="input input-bordered flex items-center gap-2"
          type="url"
          id="photo_link"
          name="photo_link"
          defaultValue={providerData?.photo_link || ""}
        />

        <button className="btn" type="submit">
          Update Provider
        </button>
        <ul>{errors && errors.map((e) => <li key={e}>{e}</li>)}</ul>
      </form>
    </AuthHelper>
  );
}
