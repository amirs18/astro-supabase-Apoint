import { LatLng, LatLngBounds } from "leaflet";
import { useState } from "react";
import { MapContainer, TileLayer, useMap, Popup, Marker } from "react-leaflet";
import Base from "../../layout/Base.astro";

const positionSE = new LatLng(-52.69636289886046, -142.07194463549587);
const positionNW = new LatLng(81.46626041478547, 93.47493036450413);
const bounds = new LatLngBounds(positionSE, positionNW);
const style = { height: "600px", width: "80%" } as const;
export function MapLeaflet() {
  return (
    <MapContainer style={style} bounds={bounds}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapOnClick />
    </MapContainer>
  );
}

function MapOnClick() {
  const [position, setPosition] = useState<LatLng>();
  const map = useMap();
  map.addEventListener("click", (e) => {
    setPosition(e.latlng);
  });

  return <>{position && <Marker position={position}></Marker>}</>;
}
