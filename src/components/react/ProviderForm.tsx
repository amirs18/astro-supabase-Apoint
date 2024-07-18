import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { type Database } from "../../lib/database.types";
import { z } from "zod";
import { AuthHelper } from "./AuthHelper";
import axios from "axios";
import { MapLeaflet, MapOnClick } from "./MapLeaflet";
import { LatLng } from "leaflet";
import { providerSchema } from "../../lib/zod.schemas";

type providerResponse =
  Database["public"]["Functions"]["get_provider_with_longlat"]["Returns"][number];

type FormInput = z.infer<typeof providerSchema>;
type PropTypes = {
  providerData?: providerResponse;
};

export function ProviderForm({ providerData }: PropTypes) {
  const { register, handleSubmit, setValue } = useForm<FormInput>();
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
        setErrors([data, "Please try again later or contact us"]);
      } else {
        window.location.href = `/provider/${data.id}`;
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <label>photo_link</label>
        <input
          {...register("photo_link")}
          className="input input-bordered flex items-center gap-2"
          type="url"
          id="photo_link"
          name="photo_link"
          defaultValue={providerData?.photo_link || ""}
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
        <label>location</label>
        <div className="flex flex-row">
          <input
            {...register("location")}
            className="input input-bordered flex items-center gap-2"
            type="text"
            id="location_long"
            name="location_long"
            defaultValue={`POINT(${providerData?.long} ${providerData?.lat})`}
          />
          <button
            className="btn"
            onClick={(e) => {
              e.preventDefault();
              const modal = document.getElementById("my_modal_5");
              if (modal !== null) {
                //@ts-expect-error
                modal.showModal();
              }
            }}
          >
            Pin on map
          </button>
          <dialog
            id="my_modal_5"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <MapLeaflet>
                <MapOnClick
                  setLonglat={setValue}
                  initialLocation={
                    new LatLng(providerData?.lat || 0, providerData?.long || 0)
                  }
                />
              </MapLeaflet>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
        <button className="btn" type="submit">
          Update Provider
        </button>

        <ul>{errors && errors.map((e) => <li key={e}>{e}</li>)}</ul>
      </form>
    </>
  );
}
