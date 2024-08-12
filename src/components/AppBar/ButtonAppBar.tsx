import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Info } from "@mui/icons-material";
import Drawer from "../Drawer/Drawer";
import { useState } from "react";
import usePokehuta from "../../hooks/usePokehuta";
import ReactMarkdown from "react-markdown";

const markdown = `
## ポケふたマップについて
「ポケふたマップ」は、本家サイト [ポケモンマンホール「ポケふた」](https://local.pokemon.jp/manhole/)を参考にデータを収集し、個人で制作した非公式のWebアプリケーションです。このアプリは、各市町村に設置された、ポケモンマンホール（ポケふた）を探しやすくするためのツールであり、ポケモン公式とは一切関係ありません。  
このプロジェクトは、個人の興味と学習目的で開発されたものです。
もし不具合や情報の誤りにお気づきの場合は、ご連絡いただければ幸いです。

### このサイトを作成した理由
本家サイトでは、日本中のポケふたを俯瞰してみることはできません。俯瞰してポケふたの地図を日本全域で見てみたい！と思いこのアプリケーションを作成しました。

### 使用した技術

- Vite(React(TypeScript))
- OpenLayers (10.0.0)
- mui v5
- firebase (Hosting, FireStoreを使用)


`;

export default function ButtonAppBar() {
  const [open, setOpen] = useState(false);
  const [, { insertData }] = usePokehuta();
  return (
    // <Box sx={{ flexGrow: 0 }}>
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ポケふたマップ
          </Typography>
          <IconButton
            size="large"
            color="inherit"
            onClick={() => {
              setOpen(true);
            }}
          >
            <Info></Info>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer open={open} setOpen={setOpen} anchor="top">
        <Box sx={{ margin: 1, height: "50vh" }}>
          {/* <div style={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              startIcon={<Close></Close>}
            ></Button>
          </div> */}
          <ReactMarkdown>{markdown}</ReactMarkdown>
          {import.meta.env.DEV && (
            <>
              <button
                onClick={() => {
                  insertData();
                }}
              >
                でーたとりこみ
              </button>
            </>
          )}
        </Box>
      </Drawer>
    </>
    // </Box>
  );
}
