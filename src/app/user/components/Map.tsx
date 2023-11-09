import React, { useMemo, useState, useEffect } from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";

interface ICoordinates {
  lat: number;
  lng: number;
}
interface IMap {
  coordinates: ICoordinates;
  containerStyle?: React.CSSProperties;
  multipleCoordinates: ICoordinates[];
  zoom?: number;
}

const Map = (props: IMap) => {
  const { coordinates, containerStyle, multipleCoordinates } = props;

  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(() => coordinates, [coordinates]);
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  const [marker, setMarker] = useState({
    lat: coordinates.lat,
    lng: coordinates.lng,
  });

  useEffect(() => {
    if (isLoaded && multipleCoordinates.length > 0) {
      // Calculate bounds to fit all the coordinates
      const bounds = new google.maps.LatLngBounds();
      multipleCoordinates.forEach((co) => {
        bounds.extend(new google.maps.LatLng(co.lat, co.lng));
      });

      // Set the center of the map to the center of the bounds
      const center = {
        lat: (bounds.getNorthEast().lat() + bounds.getSouthWest().lat()) / 2,
        lng: (bounds.getNorthEast().lng() + bounds.getSouthWest().lng()) / 2,
      };

      setMarker(center);
    }
  }, [isLoaded, multipleCoordinates]);

  if (loadError) {
    return <p>Error loading maps</p>;
  }

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <GoogleMap
        options={mapOptions}
        zoom={props.zoom || 12}
        center={multipleCoordinates.length > 0 ? marker : mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={containerStyle}
        onLoad={() => console.log("Map Component Loaded...")}
      >
        {multipleCoordinates ? (
          multipleCoordinates.map((co, index) => (
            <Marker
              key={index}
              position={co}
              onLoad={(marker) => {
                // You can add any marker customization here, if needed.
                return marker;
              }}
            />
          ))
        ) : (
          <Marker
            position={mapCenter}
            onLoad={(marker) => {
              // You can add any marker customization here, if needed.
              return marker;
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
