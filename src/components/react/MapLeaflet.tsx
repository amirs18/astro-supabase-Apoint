import { LatLng, LatLngBounds } from "leaflet";
import { useEffect, useState, type ReactNode } from "react";
import type { UseFormSetValue } from "react-hook-form";
import { MapContainer, TileLayer, useMap, Popup, Marker } from "react-leaflet";
import type { providerSchema } from "../../lib/zod.schemas";
import z from "zod";

const positionSE = new LatLng(-52.69636289886046, -142.07194463549587);
const positionNW = new LatLng(81.46626041478547, 93.47493036450413);
const bounds = new LatLngBounds(positionSE, positionNW);
const style = { height: 400 } as const;
export function MapLeaflet({ children }: { children?: ReactNode }) {
  return (
    <MapContainer style={style} bounds={bounds}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}

export function MapOnClick({
  setLonglat,
  initialLocation,
}: {
  setLonglat: UseFormSetValue<z.infer<typeof providerSchema>>;
  initialLocation?: LatLng;
}) {
  const [position, setPosition] = useState<LatLng>(
    initialLocation || new LatLng(0, 0),
  );
  const map = useMap();
  useEffect(() => {
    map.addEventListener("click", (e) => {
      setLonglat("location", `POINT(${e.latlng.lng} ${e.latlng.lat})`);
      setPosition(e.latlng);
    });
    return () => {
      map.removeEventListener("click");
    };
  }, []);

  return <>{position && <Marker position={position}></Marker>}</>;
}
