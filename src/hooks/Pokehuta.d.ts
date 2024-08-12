import { GeoPoint } from "firebase/firestore";

type Pokehuta = {
  city: string;
  pref: string;
  coordinate: GeoPoint;
  pokemons: string[];
  imageUrl: string;
  address: string;
  link: string;
};
