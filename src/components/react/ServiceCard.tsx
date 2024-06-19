import React, { useCallback } from "react";
import type { service } from "./ServicesEdit";

export function ServiceCard({
  service,
  setEditingID,
}: {
  service: service;
  setEditingID: React.Dispatch<React.SetStateAction<number>>;
}) {
  const setEditing = useCallback(() => setEditingID(service.id), []);
  return (
    <div className="card bg-base-100 shadow-xl z-10">
      <div className="card-body z-10">
        <h2 className="card-title">{service.service_name}</h2>
        <p>{service.description}</p>
        <div className="card-actions justify-end">
          <button onClick={setEditing} className="btn btn-primary">
            Edit
          </button>
          <h3>{service.price}</h3>
        </div>
      </div>
    </div>
  );
}
