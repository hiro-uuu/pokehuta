import { Search } from "@mui/icons-material";
import { createTheme, Fab, ThemeProvider, useMediaQuery } from "@mui/material";
import { Feature } from "ol";
import "ol/css";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Cluster, OSM, Vector } from "ol/source";
import VectorSource from "ol/source/Vector";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import { useCallback, useState } from "react";
import "./App.css";
import ButtonAppBar from "./components/AppBar/ButtonAppBar";
import Drawer from "./components/Drawer/Drawer";
import ClickEvent from "./features/Controls/ClickEvent";
import TileLayer from "./features/Layers/TileLayer";
import VectorLayer from "./features/Layers/VectorLayer";
import Map from "./features/Map";
import SearchList from "./features/Search/SearchList";
import { Pokehuta } from "./hooks/Pokehuta";
import usePokehuta from "./hooks/usePokehuta";
import { grey } from "@mui/material/colors";
import CircleStyle from "ol/style/Circle";
import { FeatureLike } from "ol/Feature";

const App = () => {
  const mode = useMediaQuery("(prefers-color-scheme: dark)") ? "dark" : "light";

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? grey[50] : "#90caf9", // lightモードでは白系、darkモードではデフォルトの青系
      },
    },
  });

  const [pokehuta] = usePokehuta();
  const [open, setOpen] = useState(false);

  const getSource = useCallback((): VectorSource<Feature<Point>> => {
    const vectorSource: VectorSource<Feature<Point>> = new Vector();
    pokehuta.forEach((_e: Pokehuta) => {
      const feature = new Feature({
        geometry: new Point(
          fromLonLat([_e.coordinate.longitude, _e.coordinate.latitude])
        ),
      });
      feature.setProperties(_e);

      const style = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: _e.imageUrl,
          width: 30,
          height: 30,
        }),
      });
      feature.setStyle(style);

      vectorSource.addFeature(feature);
    });
    return vectorSource;
  }, [pokehuta]);

  const clusterSource = new Cluster({
    distance: 20,
    minDistance: 100,
    source: getSource(),
  });

  const clusterStyle = (feature: FeatureLike) => {
    const size = feature.get("features").length;

    const style = new Style({
      image: new CircleStyle({
        radius: 10,
        stroke: new Stroke({
          color: "#fff",
        }),
        fill: new Fill({
          color: "#3399CC",
        }),
      }),
      text: new Text({
        text: size,
        fill: new Fill({
          color: "#fff",
        }),
      }),
    });
    return style;
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <ButtonAppBar></ButtonAppBar>
        <Map zoom={5} center={[136, 38]}>
          <TileLayer source={new OSM()} zIndex={0} />
          <VectorLayer source={getSource()} maxResolution={500}></VectorLayer>
          <VectorLayer
            source={clusterSource}
            style={clusterStyle}
            minResolution={500}
          ></VectorLayer>
          <ClickEvent />
          <Drawer open={open} anchor={"bottom"} setOpen={setOpen}>
            <SearchList setOpen={setOpen} />
          </Drawer>
          <Fab
            style={{ position: "absolute", right: 20, bottom: 50 }}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Search />
          </Fab>
        </Map>
      </ThemeProvider>
    </>
  );
};

export default App;
