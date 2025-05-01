document.querySelector('.map_content').innerHTML =
  `<div id="map" style="width:100%;height:100%"></div>`;

import { getColorByAQI } from './color.js';

/**
 * @param {string|null}   currentSiteId   目前選中的 siteid
 * @param {Function|null} onMarkerClick   外部要執行的 callback
 */
export async function renderMap (currentSiteId = null, onMarkerClick = null) {

  // 清除舊地圖的資料
  const old = L.DomUtil.get('map');
  if (old && old._leaflet_id) old._leaflet_id = null;

  // 重新建立地圖
  const map = L.map('map').setView([23.7, 120.9], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // 同步抓測站跟AQI
  const apiKey = 'b9e37fc7-b00e-4759-9315-95df2f1f918d';
  const [siteRes, aqiRes] = await Promise.all([
    fetch(`https://data.moenv.gov.tw/api/v2/aqx_p_07?language=zh&api_key=${apiKey}`).then(r => r.json()),
    fetch(`https://data.moenv.gov.tw/api/v2/aqx_p_432?language=zh&api_key=${apiKey}`).then(r => r.json())
  ]);

  // AQI Dict siteID Mapping
  const aqiDict = Object.fromEntries(
    aqiRes.records.map(r => [r.siteid, +r.aqi || null])
  );

  // 繪製地圖上的所有站點
  siteRes.records.forEach(st => {

    const lat = +st.twd97lat;
    const lon = +st.twd97lon;
    if (isNaN(lat) || isNaN(lon)) return; // error handle座標為空值

    const id     = st.siteid;
    const name   = st.sitename;
    const county = st.county;
    const aqi    = aqiDict[id];

    const { iconUrlDefault, iconUrlSelected } = getColorByAQI(aqi);
    const isSelected = id === currentSiteId;

    const icon = L.icon({
      iconUrl: isSelected ? iconUrlSelected : iconUrlDefault,
      iconSize:    [20, 20],
      iconAnchor:  [10, 10],
      popupAnchor: [0, -12],
    });

    const marker = L.marker([lat, lon], { icon })
      .addTo(map)
      .bindPopup(`<b>${name}</b>`);

    if (isSelected) marker.openPopup();

    marker.on('click', () => {
      if (typeof onMarkerClick === 'function') {
        onMarkerClick(id, name, county);
      }
    });
  });
}
