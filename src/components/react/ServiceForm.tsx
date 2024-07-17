import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { service } from "./ServicesEdit";
import { supabase } from "../../lib/supabase";

type FormInput = {
  service_name: string;
  description: string;
  price: number;
  duration: number
};
type PropTypes =
  | {
    edit: true;
    setServices: React.Dispatch<React.SetStateAction<service[] | null>>;
    providerId: number;
    service: service;
    setEditing: React.Dispatch<React.SetStateAction<number>>;
  }
  | {
    edit: false;
    setServices: React.Dispatch<React.SetStateAction<service[] | null>>;
    providerId: number;
    service?: null;
    setEditing?: null;
  };
export function ServiceForm({
  edit,
  setServices,
  providerId,
  service,
  setEditing,
}: PropTypes) {
  const { register, handleSubmit, reset } = useForm<FormInput>();

  const onDelete = async () => {
    if (edit) {
      const deletedService = await supabase
        .from("services")
        .delete()
        .eq("id", service.id)
        .select()
        .single();
      if (deletedService.data !== null) {
        setServices((prev) => {
          const arr = prev!.filter((item) => item.id !== service.id);
          return arr;
        });
      }
      setEditing(0);
    }
  };

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    if (edit) {
      const newService = await supabase
        .from("services")
        .update({ ...data })
        .eq("id", service.id)
        .select()
        .single();
      if (newService.data !== null) {
        setServices((prev) =>
          prev!.map((sr) => {
            if (sr.id === newService.data.id) {
              return newService.data;
            } else {
              return sr;
            }
          }),
        );
        setEditing(0);
      }
    } else {
      const newService = await supabase
        .from("services")
        .insert({ ...data, provider_id: providerId })
        .select()
        .limit(1)
        .single();
      if (newService.data !== null) {
        setServices((prev) =>
          prev ? [...prev, newService.data] : [newService.data],
        );
        reset();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="card bg-base-100 shadow-xl z-10">
        <div className="card-body z-10">
          <h2 className="card-title">
            {edit ? service.service_name : "Add New Service"}
          </h2>
          <input
            {...register("service_name")}
            className="input input-bordered flex items-center gap-2"
            type="text"
            id="service_name"
            name="service_name"
            defaultValue={edit ? service.service_name : ""}
            placeholder={edit ? service.service_name : "service name"}
          />
          <input
            {...register("description")}
            className="input input-bordered flex items-center gap-2"
            type="text"
            id="description"
            name="description"
            defaultValue={edit ? service.description! : ""}
            placeholder={edit ? service.description! : "description"}
          />
          <input
            {...register("duration")}
            className="input input-bordered flex items-center gap-2"
            type="number"
            id="duration"
            name="duration"
            defaultValue={edit ? service.duration! : ""}
            placeholder={edit ? `${service.duration}` : 'duration'}
          />
          <div className="card-actions justify-between">
            <input
              {...register("price")}
              className="input input-bordered w-28 flex items-center gap-2"
              type="number"
              id="price"
              name="price"
              defaultValue={edit ? service.price : ""}
              placeholder={edit ? service.price.toString() : "price"}
            />
            <button type="submit" className="btn btn-primary">
              {edit ? "Save" : "Add"}
            </button>
            {edit && (
              <button
                onClick={onDelete}
                type="button"
                className="btn btn-primary"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
