import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { type Database } from "../../lib/database.types";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export type Service = Database["public"]["Tables"]["services"]["Insert"];

export const ServicesEdit = ({
  services,
  providerId,
}: {
  services: Service[] | null;
  providerId: number;
}) => {
  const [data, setData] = useState(services);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const fetchData = async (newData?: Partial<Service>) => {
    setIsLoading(true);
    try {
      const res = await axios({
        method: newData ? "POST" : "GET",
        url: `/api/services/${providerId}`,
        data: newData,
      });

      if (!res.data) {
        throw new Error("No data received");
      }

      setData((prev) => (newData ? [...res.data, ...prev] : res.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array for initial fetch

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(formRef.current!);
    const name = formData.get("name")?.toString();
    const price = Number(formData.get("price"));
    const description = formData.get("description")?.toString();

    if (!name || !price || !description) return;

    fetchData({ service_name, price, description, provider_id: providerId });
    formRef.current!.reset();
    toast.success("Service added successfully");
  };

  return (
    <div className="max-w-3xl w-full">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        ref={formRef}
        className="block border bg-blue-100 border-blue-300 rounded-md p-6 dark:bg-blue-950 dark:border-blue-800"
      >
        <div>
          <label
            htmlFor="name"
            className="block mb-1 font-medium dark:text-zinc-300 text-zinc-900 text-sm"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Service Name"
            required
            className="w-full block rounded-md py-1 px-3 dark:bg-zinc-800 dark:text-zinc-300 border bg-zinc-50 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">Name is required</p>
          )}
        </div>
        <div className="mt-3">
          <label
            htmlFor="price"
            className="block mb-1 font-medium dark:text-zinc-300 text-zinc-900 text-sm"
          >
            Price
          </label>
          <input
            id="price"
            type="number"
            className="w-full block rounded-md py-1 px-3 dark:bg-zinc-800 dark:text-zinc-300 border bg-zinc-50 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
            placeholder="Price"
            required
            {...register("price", { required: true })}
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">Price is required</p>
          )}
        </div>
        <div className="mt-3">
          <label
            htmlFor="description"
            className="block mb-1 font-medium dark:text-zinc-300 text-zinc-900 text-sm"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="w-full block rounded-md py-1 px-3 dark:bg-zinc-800 dark:text-zinc-300 border bg-zinc-50 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
            placeholder="Description"
            required
            {...register("description", { required: true })}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">Description is required</p>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
        >
          Add Service
        </button>
      </form>
    </div>
  );
};
