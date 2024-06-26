import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { type Database } from "../../lib/database.types";

export type GuestbookEntry =
  Database["public"]["Tables"]["providers"]["Insert"];

export const Reviews = ({ reviews }: { reviews: GuestbookEntry[] }) => {
  const [data, setData] = useState(reviews);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const fetchData = async (newData?: Partial<GuestbookEntry>) => {
    setIsLoading(true);
    try {
      const res = await axios({
        method: newData ? "POST" : "GET",
        url: "/api/provider",
        data: newData,
      });

      if (!res.data) {
        throw new Error("No data received");
      }

      setData((prev) => (newData ? [res.data, ...prev] : res.data));
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
    const email = formData.get("message")?.toString();

    if (!name || !email) return;

    fetchData({ name, email });
    formRef.current!.reset();
  };

  return (
    <div className="max-w-3xl w-full">
      <form
        onSubmit={onSubmitHandler}
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
            placeholder="Sam"
            required
            name="name"
            className="w-full block rounded-md py-1 px-3 dark:bg-zinc-800 dark:text-zinc-300 border bg-zinc-50 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
          />
        </div>
        <div className="mt-3">
          <label
            htmlFor="message"
            className="block mb-1 font-medium dark:text-zinc-300 text-zinc-900 text-sm"
          >
            Message
          </label>
          <input
            id="message"
            type="text"
            className="w-full block rounded-md py-1 px-3 dark:bg-zinc-800 dark:text-zinc-300 border bg-zinc-50 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
            placeholder="A friendly message"
            required
            name="message"
          />
        </div>
        <button
          className="w-full dark:bg-zinc-100 bg-zinc-900 border-zinc-900 py-1.5 border dark:border-zinc-100 rounded-md mt-4 dark:text-zinc-900 text-zinc-100 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {data.length === 0 && !isLoading && <p>No reviews yet.</p>}
        {data.map((review) => (
          <li
            key={review.id}
            className="p-4 border rounded-md bg-white dark:bg-zinc-800 dark:border-zinc-700"
          >
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {review.email}
            </p>
            <p className="mt-1">{review.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
