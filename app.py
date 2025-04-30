import requests
import os
from dotenv import load_dotenv
load_dotenv()

# 以下為自訂排程發布訊息所需套件
# import discord
# from discord.ext import commands
# from apscheduler.schedulers.asyncio import AsyncIOScheduler
# from datetime import datetime
# import asyncio


# 處理天氣相關程式碼
def get_weather_data():
    API_AUTH = os.getenv("WEATHER_KEY")

    params = {
        "Authorization": API_AUTH,
        "locationName": "臺北市"
    }

    res = requests.get("https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001", params=params)

    weather = {}
    for i in range(0, 5):
        name = res.json()["records"]["location"][0]["weatherElement"][i]["elementName"]
        value = res.json()["records"]["location"][0]["weatherElement"][i]["time"][0]["parameter"]["parameterName"]

        weather[name] = value

    weather_situation = weather["Wx"]
    rain_situation = weather["PoP"]
    min_temperature = weather["MinT"]
    comfort = weather["CI"]
    max_temperature = weather["MaxT"]

    startTime = res.json()["records"]["location"][0]["weatherElement"][0]["time"][0]["startTime"]
    endTime = res.json()["records"]["location"][0]["weatherElement"][0]["time"][0]["endTime"]

    text_weather = f'''
★ 時間：{startTime[5:-3]} - {endTime[5:-3]}
★ 天氣現象：{weather_situation}
★ 降雨機率：{rain_situation} %
★ 舒適度：{comfort}
★ 最高溫度：{max_temperature} °C
★ 最低溫度：{min_temperature} °C'''
    
    return text_weather

def show_weather_data():
    text_weather = get_weather_data()
    source_weather = "中央氣象署"
    title_weather = "臺北市當前天氣預報"
    img_url_weather = "https://image-tc.galaxy.tf/wijpeg-19za0ro24q24b9b9ez8lz2e9x/taipei-101_standard.jpg?crop=112%2C0%2C1777%2C1333&width=1140"

    notify_tomyself(text_weather, title_weather, source_weather, img_url_weather)
    notify_discord_webhook(text_weather, title_weather, source_weather, img_url_weather)


# 定義發佈到自訂頻道的函式
def notify_tomyself(msg, title, source, img_url):
    token = os.getenv("DISCORD_TOKEN")
    channel_id = os.getenv("DISCORD_CHANNEL_ID")

    url_base = 'https://discord.com/api/v10'
    url = f"{url_base}/channels/{channel_id}/messages"

    headers = {
        "Authorization": f"Bot {token}",
        "Content-Type": "application/json"
    }
    data = {
        "embeds":[
              {
                    "title": title,
                    "description": msg,
                    "color": 0x00bfff,
                    "thumbnail": {
                          "url": img_url
                    },
                    "footer": {
                          "text": "資料來源：" + source
                    }

              }
        ]
    }
    res = requests.post(url, headers = headers, json = data)

    if res.status_code in (200, 204):
        print(f"Request fulfilled: {res.text}")
    else:
        print(f"Request failed: {res.status_code}-{res.text}")


# 定義發佈到老師的頻道(bot)的函式
def notify_discord_webhook(msg, title, source, img_url):
    webhook_url = "https://discord.com/api/webhooks/1366080384927793243/X9l12ZV5rpuJfiTKhdzT4JDw9VlMkkluotj70-FmQh2xIG7QPmew8U1LtuOikecg00MY"
    data = {
        "username": "一袋米要扛幾樓",
        "avatar_url": "https://pgw.worldjournal.com/gw/photo.php?u=https://uc.udn.com.tw/photo/wj/realtime/2025/04/25/31928586.jpg&x=0&y=0&sw=0&sh=0&sl=W&fw=800&exp=3600&q=75",
        "embeds": [
            {
                "title": "🌤️ " + title,
                # "url": "https://airtw.moenv.gov.tw/?utm_source=airtw&utm_medium=gitech&utm_campaign=airTW_AQmap",
                "description": msg,
                "color": 0x00bfff,
                "thumbnail": {
                    "url": img_url
                },
                "footer": {
                    "text": "資料來源：" +source
                }
            }
        ]
    }
    res = requests.post(webhook_url, json=data)
    if res.status_code in (200, 204):
        print(f"Webhook request fulfilled with response: {res.text}")
    else:
        print(f"Webhook request failed with response: {res.status_code} - {res.text}")


# 處理空氣品質

def get_all_aqi_data(api_key):
    url = f"https://data.moenv.gov.tw/api/v2/aqx_p_432?&api_key={api_key}"
    response = requests.get(url)
    response.raise_for_status()  # 若失敗會丟出錯誤
    return response.json()

def show_pollutants_table(api_key, current_site):
    all_aqi_data = get_all_aqi_data(api_key)
    records = all_aqi_data.get("records", [])

    aqi_data_for_selected_site = next(
        (record for record in records if record.get("sitename") == current_site),
        None
    )

    if aqi_data_for_selected_site:
        print(aqi_data_for_selected_site)

        county = aqi_data_for_selected_site["county"]
        sitename = aqi_data_for_selected_site["sitename"]

        aqi = aqi_data_for_selected_site["aqi"]
        if not aqi:
            aqi = "暫無資料"
            
        status = aqi_data_for_selected_site["status"]
        so2 = aqi_data_for_selected_site["so2"]
        co = aqi_data_for_selected_site["co"]
        o3 = aqi_data_for_selected_site["o3"]
        pm2dot5 = aqi_data_for_selected_site["pm2.5"]
        publishtime = aqi_data_for_selected_site["publishtime"][0:-3]

        text_air = (
            f"★ 測站名稱：{county} {sitename}\n"
            f"★ 空氣品質：{status}\n"
            f"★ AQI指數：{aqi}\n"
            f"★ 二氧化硫：{so2}\n"
            f"★ 一氧化碳：{co}\n"
            f"★ 臭氧濃度：{o3}\n"
            f"★ PM2.5：{pm2dot5}\n"
            f"★ 發布時間：{publishtime}".replace(" ", "\u00A0")
        )
        print(text_air)
        
        source_air = "行政院環保署"
        title_air = county + "當前空氣品質報告"
        img_url_air = "https://live.staticflickr.com/65535/54282594670_5b4594b3da_o.png"

        notify_tomyself(text_air, title_air, source_air, img_url_air)
        notify_discord_webhook(text_air, title_air, source_air, img_url_air)
        
    else:
        print(f"找不到站點：{current_site}")



air_key = os.getenv("AIR_KEY")

show_pollutants_table(air_key, "中山")
show_weather_data()

