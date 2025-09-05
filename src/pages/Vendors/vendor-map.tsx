import {
  Autocomplete,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const mapRef = React.useRef<google.maps.Map | null>(null);

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
    if (currentCoords && !selected) {
      setSelected(currentCoords);
    }
  }, [currentCoords, selected]);

  return (
    <Card className="pb-4">
      <CardHeader>
        <h4 className="card-title mb-0">{t("Select Vendor Location")}</h4>
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
            libraries={["places"]}
          >
            <div style={{ marginBottom: 10 }}>
              <div style={{ maxWidth: 420 }}>
                <Autocomplete
                  onLoad={(ref) => setAutocomplete(ref)}
                  onPlaceChanged={() => {
                    const place = autocomplete?.getPlace();
                    const loc = place?.geometry?.location;
                    if (!loc) return;
                    const coords = { lat: loc.lat(), lng: loc.lng() };
                    setSelected(coords);
                    selectedCoords(coords);
                    if (mapRef.current) {
                      mapRef.current.panTo(coords);
                      mapRef.current.setZoom(15);
                    }
                  }}
                  options={{
                    fields: [
                      "geometry",
                      "formatted_address",
                      "name",
                      "place_id",
                    ],
                    types: ["geocode"],
                  }}
                >
                  <input
                    type="text"
                    placeholder={t("Search location")}
                    className="form-control"
                    style={{ background: "#fff" }}
                  />
                </Autocomplete>
              </div>
            </div>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={selected || currentCoords || dubai}
              zoom={selected ? 14 : 10}
              onClick={handleMapClick}
              onLoad={(map) => {
                mapRef.current = map;
              }}
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
