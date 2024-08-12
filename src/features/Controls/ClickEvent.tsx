import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Link,
  Typography,
} from "@mui/material";
import "ol/ol.css";
import React, { useContext, useEffect, useState } from "react";
import Drawer from "../../components/Drawer/Drawer";
import { Pokehuta } from "../../hooks/Pokehuta";
import MapContext from "../Map/MapContext";
import { Close } from "@mui/icons-material";

const ClickEvent = () => {
  const map = useContext(MapContext);
  const [properties, setProperties] = useState<
    Pokehuta | { [x: string]: any }
  >();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (!map) return;
    //クリックイベントを設定します。
    map.on("singleclick", function (evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });
      const property = feature?.getProperties();
      if (property?.coordinate) {
        setProperties(feature?.getProperties());
        console.log(feature?.getProperties());

        // ヒット時にdrawer表示
        feature && setOpen(true);
      }
    });
  }, [map]);

  return (
    <>
      <Drawer open={open} setOpen={setOpen} anchor="bottom">
        <Card sx={{ padding: 1 }}>
          <CardMedia
            component="img"
            sx={{ height: "50vh", objectFit: "contain" }}
            // sx={{ height: 400 }}
            image={properties?.imageUrl}
            alt={"マンホール画像"}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {properties?.pref}, {properties?.city}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {properties?.address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              緯度: {properties?.coordinate.latitude.toFixed(5)}, 経度:
              {properties?.coordinate.longitude.toFixed(5)}
            </Typography>
            {properties?.pokemons.map((e: string, index: number) => (
              <Chip key={index} label={e}></Chip>
            ))}
            <br />
            <Link href={properties?.link} underline="always">
              公式サイトリンク
            </Link>
          </CardContent>
          <CardActions>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              startIcon={<Close></Close>}
            >
              地図にもどる
            </Button>
          </CardActions>
        </Card>
      </Drawer>
    </>
  );
};

export default ClickEvent;
