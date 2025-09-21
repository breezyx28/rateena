import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import { useTranslation } from "react-i18next";

// Extend Window interface to include Google Maps types
declare global {
  interface Window {
    google: typeof google;
  }
}

const containerStyle = {
  width: "100%",
  height: "300px",
};

const dubai = { lat: 25.276987, lng: 55.296249 };

// Define libraries array outside component to prevent unnecessary reloads
const libraries: "places"[] = ["places"];

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
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const mapRef = React.useRef<google.maps.Map | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Initialize Autocomplete when Google Maps is loaded
  const initializeAutocomplete = () => {
    if (
      window.google &&
      window.google.maps &&
      window.google.maps.places &&
      inputRef.current &&
      !autocomplete
    ) {
      const autoCompleteInstance = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: "ae" },
          types: ["geocode"],
        }
      );

      autoCompleteInstance.addListener("place_changed", () => {
        const place = autoCompleteInstance.getPlace();
        if (place.geometry && place.geometry.location) {
          const coords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setSelected(coords);
          selectedCoords(coords);
          if (mapRef.current) {
            mapRef.current.panTo(coords);
            mapRef.current.setZoom(15);
          }
        }
      });

      setAutocomplete(autoCompleteInstance);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeAutocomplete();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [autocomplete]);

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
            libraries={libraries}
          >
            <div style={{ marginBottom: 10 }}>
              <div style={{ maxWidth: 420 }}>
                <input
                  id="map-location-autocomplete"
                  ref={inputRef}
                  type="text"
                  placeholder={t("Search location")}
                  className="form-control"
                  style={{ background: "#fff" }}
                />
              </div>
            </div>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={selected || currentCoords || dubai}
              zoom={selected ? 14 : 10}
              onClick={handleMapClick}
              options={{
                gestureHandling: "greedy",
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
              }}
              onLoad={(map) => {
                mapRef.current = map;
                setTimeout(() => {
                  initializeAutocomplete();
                }, 500);
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
