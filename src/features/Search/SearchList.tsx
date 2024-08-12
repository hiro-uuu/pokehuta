import {
  Avatar,
  Box,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { Coordinate } from "ol/coordinate";
import { fromLonLat } from "ol/proj";
import * as React from "react";
import { useState } from "react";
import { Pokehuta } from "../../hooks/Pokehuta";
import usePokehuta from "../../hooks/usePokehuta";
import MapContext from "../Map/MapContext";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SearchList({ setOpen }: Props) {
  const [pokehuta] = usePokehuta();
  const [searchTerm, setSearchTerm] = useState("");
  const map = React.useContext(MapContext);
  // const length = pokehuta ? pokehuta.length : 0;

  // 検索キーワードに基づいてリストをフィルタリング
  const filteredItems = pokehuta.filter((item: Pokehuta) => {
    //都道府県での絞り込み
    const prefFilter = item.pref
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const cityFilter = item.city
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const pokemonFilter = item.pokemons
      .join(",")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return prefFilter || cityFilter || pokemonFilter;
  });

  /**
   * リストをクリックしたときの処理です。
   * @param item
   */
  const handleListClick = (item: Pokehuta): void => {
    console.log(item.coordinate.toJSON());
    setCenter([item.coordinate.longitude, item.coordinate.latitude], 15);
    setOpen(false);
  };
  /**
   * 指定座標を中心に移動します。
   * @param coodinate 移動座標
   * @param zoom ズームレベル
   */
  const setCenter = React.useCallback(
    (coodinate: Coordinate, zoom?: number) => {
      const view = map && map.getView();

      if (zoom === undefined) {
        //ズームレベルの指定がないとき
        view &&
          view.animate({
            center: fromLonLat(coodinate),
            duration: 500, // 2秒かけて移動
          });
      } else {
        //ズームレベルの指定があるとき
        view &&
          view.animate({
            center: fromLonLat(coodinate),
            zoom: zoom,
            duration: 500, // 2秒かけて移動
          });
      }
    },
    [map]
  );

  return (
    <>
      {/* 検索用のテキストフィールド */}
      <Box sx={{ m: 2 }}>
        {/* <div>{`全 ${length} 箇所`}</div> */}
        <TextField
          style={{ textAlign: "center" }}
          label="ポケモンのなまえ、都道府県、市町村名を入力"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* 絞り込まれたリストを表示 */}
        <List style={{ maxHeight: "40vh" }}>
          {filteredItems.map((item: Pokehuta, index: number) => (
            <ListItemButton key={index} onClick={() => handleListClick(item)}>
              <ListItemAvatar>
                <Avatar src={item.imageUrl}></Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${item.pokemons.join(", ")}`}
                secondary={`${item.pref}, ${item.city}`}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </>
  );
}
