import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const dubai = { lat: 25.276987, lng: 55.296249 };

const VendorMap = ({
  selectedCoords,
  currentCoords,
}: {
  selectedCoords: React.Dispatch<any>;
  currentCoords: { lat: number; lng: number } | undefined;
}) => {
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const coords = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setSelected(coords);
      selectedCoords(coords); // send to parent
    }
  };

  React.useEffect(() => {
    if (currentCoords) {
      setSelected(currentCoords);
    }
  }, [currentCoords]);

  return (
    <Card>
      <CardHeader>
        <h4 className="card-title mb-0">Select Vendor Location</h4>
        {selected && (
          <div className="w-full d-flex justify-content-center justify-items-center gap-4">
            <span className="text-success badge-success">
              Lat: {selected.lat}
            </span>
            <span className="text-success badge-success">
              Lng: {selected.lng}
            </span>
          </div>
        )}
      </CardHeader>
      <CardBody>
        <div
          id="gmaps-markers"
          className="gmaps"
          style={{ position: "relative" }}
        >
          <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? ""}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={dubai}
              zoom={10}
              onClick={handleMapClick} // capture clicks
            >
              {/* Show marker at clicked location */}
              {selected && <Marker position={selected} />}
            </GoogleMap>
          </LoadScript>
        </div>
      </CardBody>
    </Card>
  );
};

export default VendorMap;
