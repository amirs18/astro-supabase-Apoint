import React, { useState } from "react";
import type { Database } from "../../lib/database.types";
import { AuthHelper } from "./AuthHelper";
import { ServiceCard } from "./ServiceCard";
import { ServiceForm } from "./ServiceForm";

export type service = Database["public"]["Tables"]["services"]["Row"];

export function ServiceEdit({
  services: initalServices,
  providerId,
}: {
  services: service[] | null;
  providerId: number;
}) {
  const [services, setServices] = useState<service[] | null>(initalServices);
  const [editingId, setEditingID] = useState<number>(0);
  if (services === null) return null;

  return (
    <AuthHelper>
      <div className="grid md:grid-cols-2 gap-4 sm:grid-cols-1">
        {services.map((service) => {
          if (service.id === editingId)
            return (
              <ServiceForm
                edit={true}
                providerId={providerId}
                setServices={setServices}
                key={service.id}
                service={service}
                setEditing={setEditingID}
              />
            );
          return (
            <ServiceCard
              key={service.id}
              setEditingID={setEditingID}
              service={service}
            />
          );
        })}
        <ServiceForm
          edit={false}
          providerId={providerId}
          service={null}
          setServices={setServices}
        />
      </div>
    </AuthHelper>
  );
}
