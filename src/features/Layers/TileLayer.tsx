import OlTileLayer from "ol/layer/Tile";
import TileSource from "ol/source/Tile";
import { FC, useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";

type Props = {
  source: TileSource;
  zIndex: number;
};

const TileLayer: FC<Props> = ({ source, zIndex = 0 }) => {
  const map = useContext(MapContext);
  useEffect(() => {
    if (!map) return;
    let tileLayer = new OlTileLayer({
      source,
      zIndex,
    });
    map.addLayer(tileLayer);
    return () => {
      if (map) {
        map.removeLayer(tileLayer);
      }
    };
  }, [map]);

  return null;
};

export default TileLayer;
