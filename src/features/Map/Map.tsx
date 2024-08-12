import React, { useEffect, useRef, useState } from "react";
import { Map as OLMap, View } from "ol";
import MapContext from "./MapContext";
import "ol/ol.css";
import { Coordinate } from "ol/coordinate";
import { fromLonLat, transformExtent } from "ol/proj";
import { defaults as defaultControls } from "ol/control";

type Props = {
  children: React.ReactNode;
  zoom: number;
  center: Coordinate;
};

const Map = ({ children, zoom, center }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<null | OLMap>(null);

  useEffect(() => {
    let mapObject = new OLMap({
      target: mapRef.current as HTMLElement,
      view: new View({
        zoom,
        center: fromLonLat(center),
        projection: "EPSG:3857",
        extent: transformExtent([120, 20, 150, 60], "EPSG:4326", "EPSG:3857"),
      }),
      controls: defaultControls({
        zoom: false,
        rotate: false,
      }),
    });

    setMap(mapObject);
    return () => mapObject.setTarget(undefined);
  }, []);

  return (
    <MapContext.Provider value={map}>
      <div
        ref={mapRef}
        className="map"
        style={{ width: "100%", height: "100vh", position: "absolute" }}
      >
        {children}
      </div>
    </MapContext.Provider>
  );
};

export default Map;
