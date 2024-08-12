import { Feature } from "ol";
import OLVectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style } from "ol/style";
import { FC, useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import { FeatureLike } from "ol/Feature";

type Props = {
  source: VectorSource<Feature<any>>;
  style?: Style | ((feature: FeatureLike) => Style);
  zIndex?: number;
  maxResolution?: number;
  minResolution?: number;
};

const VectorLayer: FC<Props> = ({
  source,
  style,
  zIndex,
  maxResolution,
  minResolution,
}) => {
  const map = useContext(MapContext);
  useEffect(() => {
    if (!map) return;

    let vectorLayer = new OLVectorLayer({
      source,
      zIndex,
      style,
      maxResolution,
      minResolution,
    });

    map.addLayer(vectorLayer);

    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [source]);

  return null;
};

export default VectorLayer;
