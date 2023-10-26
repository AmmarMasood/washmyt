import React, { useMemo, useState } from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";

interface IMap {
  coordinates: {
    lat: number;
    lng: number;
  };
}

const Map = (props: IMap) => {
  const { coordinates } = props;

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
        zoom={14}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{
          width: "100%",
          height: "500px",
          borderRadius: "30px",
        }}
        onLoad={() => console.log("Map Component Loaded...")}
      >
        <Marker
          position={mapCenter}
          onLoad={(marker) => {
            // You can add any marker customization here, if needed.
            return marker;
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default Map;
