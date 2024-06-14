import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { Database } from "../../lib/database.types";
import { supabase } from "../../lib/supabase";
import cookie from "cookie";
import { AuthHelper } from "./AuthHelper";

export type services = Database["public"]["Tables"]["services"]["Row"];

type FormInput = {
  service_name: string;
  description: string;
  price: number;
};
export function ServicesCards({
  services: initalServices,
  providerId,
}: {
  services: services[] | null;
  providerId: number;
}) {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const [services, setServices] = useState<services[] | null>(initalServices);
  if (services === null) return null;

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const newService = await supabase
      .from("services")
      .insert({ ...data, provider_id: providerId })
      .select();
    if (newService.data !== null) {
      setServices([...services, ...newService.data]);
      reset();
    }
  };

  return (
    <AuthHelper>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
        {services.map((service) => {
          return (
            <div key={service.id} className="card w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{service.service_name}</h2>
                <p>{service.description}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Book Now</button>
                  <h3>{service.price}</h3>
                </div>
              </div>
            </div>
          );
        })}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Add New Service</h2>
              <input
                {...register("service_name")}
                className="input input-bordered flex items-center gap-2"
                type="text"
                id="service_name"
                name="service_name"
                placeholder="Service Name"
              />
              <input
                {...register("description")}
                className="input input-bordered flex items-center gap-2"
                type="text"
                id="description"
                name="description"
                placeholder="Description"
              />
              <div className="card-actions justify-between">
                <input
                  {...register("price")}
                  className="input input-bordered w-28 flex items-center gap-2"
                  type="text"
                  id="price"
                  name="price"
                  placeholder="Price"
                />
                <button className="btn btn-primary">Add</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AuthHelper>
  );
}
