from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
from selenium.webdriver.chrome import service as fs
import time
import json
from selenium import webdriver


class GeoPoint:
    def __init__(self, latitude, longitude):
        self.latitude = latitude
        self.longitude = longitude

class Pokehuta:
    def __init__(self, city, pref, coordinate, pokemons, imageUrl, address, link):
        self.city = city
        self.pref = pref
        self.coordinate = coordinate
        self.pokemons = pokemons
        self.imageUrl = imageUrl
        self.address = address
        self.link = link


# ブラウザを開く
chrome_service = fs.Service(executable_path='/opt/homebrew/bin/chromedriver')
driver = webdriver.Chrome(service=chrome_service)

pref_urls = [
    "https://local.pokemon.jp/manhole/hokkaido.html",
    "https://local.pokemon.jp/manhole/aomori.html",
    "https://local.pokemon.jp/manhole/iwate.html",
    "https://local.pokemon.jp/manhole/miyagi.html",
    "https://local.pokemon.jp/manhole/akita.html",
    "https://local.pokemon.jp/manhole/fukushima.html",
    "https://local.pokemon.jp/manhole/tochigi.html",
    "https://local.pokemon.jp/manhole/saitama.html",
    "https://local.pokemon.jp/manhole/chiba.html",
    "https://local.pokemon.jp/manhole/tokyo.html",
    "https://local.pokemon.jp/manhole/kanagawa.html",
    "https://local.pokemon.jp/manhole/niigata.html",
    "https://local.pokemon.jp/manhole/toyama.html",
    "https://local.pokemon.jp/manhole/ishikawa.html",
    "https://local.pokemon.jp/manhole/fukui.html",
    "https://local.pokemon.jp/manhole/gifu.html",
    "https://local.pokemon.jp/manhole/shizuoka.html",
    "https://local.pokemon.jp/manhole/aichi.html",
    "https://local.pokemon.jp/manhole/mie.html",
    "https://local.pokemon.jp/manhole/shiga.html",
    "https://local.pokemon.jp/manhole/kyoto.html",
    "https://local.pokemon.jp/manhole/osaka.html",
    "https://local.pokemon.jp/manhole/hyogo.html",
    "https://local.pokemon.jp/manhole/nara.html",
    "https://local.pokemon.jp/manhole/wakayama.html",
    "https://local.pokemon.jp/manhole/tottori.html",
    "https://local.pokemon.jp/manhole/okayama.html",
    "https://local.pokemon.jp/manhole/yamaguchi.html",
    "https://local.pokemon.jp/manhole/tokushima.html",
    "https://local.pokemon.jp/manhole/kagawa.html",
    "https://local.pokemon.jp/manhole/ehime.html",
    "https://local.pokemon.jp/manhole/fukuoka.html",
    "https://local.pokemon.jp/manhole/saga.html",
    "https://local.pokemon.jp/manhole/nagasaki.html",
    "https://local.pokemon.jp/manhole/miyazaki.html",
    "https://local.pokemon.jp/manhole/kagoshima.html",
    "https://local.pokemon.jp/manhole/okinawa.html"
]

# pref_urls = [
#     "https://local.pokemon.jp/manhole/hokkaido.html",
# ]


# 対象のURLにアクセス
baseurl = 'https://local.pokemon.jp/manhole/'
pokemon_manholes = []

for j in range(len(pref_urls)):
    driver.get(pref_urls[j])

    try:
        manhole_list = driver.find_elements(By.CSS_SELECTOR, '#contents > section.manhole-municipality-list > ul > li.manhole-item > a.manhole-detail')

        manhole_urls = []

        for i in range(len(manhole_list)):
            manhole_urls.append(manhole_list[i].get_attribute('href'))

        for i in range(len(manhole_urls)):
            partial_url = manhole_urls[i]
            driver.get(partial_url)
            print(partial_url)
            # time.sleep(3)
            
            page_source = driver.page_source
            soup = BeautifulSoup(page_source, 'html.parser')

            prefecture_city = soup.select('body > div > div.heading > h1')
            if prefecture_city:
                pref = prefecture_city[0].get_text().split('/')[0]
                city = prefecture_city[0].get_text().split('/')[1]
            else:
                pref = city = "要素が見つかりませんでした。"

            ul_element = driver.find_element(By.CSS_SELECTOR, 'body > div > div.inner > div.zukan > ul')
            pokemon_names = [li.find_element(By.TAG_NAME, 'span').text for li in ul_element.find_elements(By.TAG_NAME, 'li')]

            img_element = driver.find_element(By.CSS_SELECTOR, 'body > div > div.heading > img')
            image_url = img_element.get_attribute('src')

            gmapiframe = driver.find_element(By.CSS_SELECTOR, "body > div > div.inner > div.block.map > div.googlemap > iframe").get_attribute('src')
            lat_long = gmapiframe.split("q=")[1].split("&")[0]
            latitude, longitude = lat_long.split(",")

            coordinate = GeoPoint(float(latitude), float(longitude))

            # 住所
            address =  driver.find_element(By.CSS_SELECTOR, "body > div.detail-manhole > div.inner > div.block.map > p").text
            print(address)

            pokehuta = Pokehuta(city=city, pref=pref, coordinate=coordinate, pokemons=pokemon_names, imageUrl=image_url, address=address, link=partial_url)
            pokemon_manholes.append(pokehuta)

            print(vars(pokehuta))

    except Exception as e:
        print(f"エラーが発生しました: {e}")


# ブラウザを閉じる
driver.quit()

class PokehutaEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, GeoPoint):
            return {"latitude": obj.latitude, "longitude": obj.longitude}
        if isinstance(obj, Pokehuta):
            return {
                "city": obj.city,
                "pref": obj.pref,
                "coordinate": {
                    "latitude": obj.coordinate.latitude,
                    "longitude": obj.coordinate.longitude,
                },
                "pokemons": obj.pokemons,
                "imageUrl": obj.imageUrl,
                "address": obj.address,
                "link": obj.link
            }
        return super().default(obj)

# pokemon_manholesのリストをJSON形式で出力
with open("pokemon_manholes.json", "w", encoding="utf-8") as f:
    json.dump(pokemon_manholes, f, ensure_ascii=False, indent=4, cls=PokehutaEncoder)

print("JSONファイルに出力されました。")