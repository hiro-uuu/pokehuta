import {
  collection,
  DocumentData,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../libs/firebase";
import { Pokehuta } from "./Pokehuta";
import { generateid } from "../utils/generateUUID";
import { pokemon_manholes } from "../data/pokemon_manholes";

const usePokehuta = () => {
  const [pokehutas, setPokehutas] = useState<Pokehuta[] | DocumentData>([]);

  /**
   * 初回にポケふた座標を取得
   */
  useEffect(() => {
    const fetch = async () => {
      const querySnapshot = await getDocs(collection(db, "t_pokehuta"));
      let pokehutaArr: Pokehuta[] | DocumentData = [];
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          pokehutaArr.push(doc.data());
        }
      });
      setPokehutas(pokehutaArr);
    };

    fetch();
  }, []);

  const insertData = () => {
    const insertPokehutas: Pokehuta[] = pokemon_manholes;
    insertPokehutas.forEach(async (poke) => {
      await setDoc(doc(db, "t_pokehuta", generateid()), poke);
    });
  };

  return [pokehutas, { insertData }] as const;
};

export default usePokehuta;
