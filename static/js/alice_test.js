document.querySelector(".map_content").innerHTML = `<div id="map" style="width: 600px; height: 700px;"></div>`;

export function renderMap(currentSiteId, onMarkerClick) {
  if (L.DomUtil.get("map") != null) {
    L.DomUtil.get("map")._leaflet_id = null;
  }

  const map = L.map("map").setView([23.7, 120.9], 8);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const stationMap = {};

  fetch("https://data.moenv.gov.tw/api/v2/aqx_p_07?language=zh&api_key=b9e37fc7-b00e-4759-9315-95df2f1f918d")
    .then(res => res.json())
    .then(data => {
      data.records.forEach((st) => {
        const lat = parseFloat(st.twd97lat);
        const lon = parseFloat(st.twd97lon);
        const name = st.sitename;
        const id = st.siteid;
        const county = st.county;

        if (!isNaN(lat) && !isNaN(lon)) {
          const isSelected = currentSiteId
            ? st.siteid === currentSiteId
            : st.sitename === currentSiteName;

          const icon = L.icon({
            iconUrl: isSelected
              ? "./static/img/green_selected.png"
              : "./static/img/green_default.png",
            iconSize:     [20, 20],
            iconAnchor:   [10, 10],
            popupAnchor:  [0, -12]
          });

          const marker = L.marker([lat, lon], { icon })
            .addTo(map)
            .bindPopup(`<b>${name}</b>`);

          // 預設展開 popup（僅選中的）
          if (isSelected) {
            marker.openPopup();
          }

          marker.on("click", () => {
            if (typeof onMarkerClick === "function") {
              onMarkerClick(id, name, county);
            }
          });

          stationMap[id] = {
            county,
            name,
            lat,
            lon,
            marker,
            data: st
          };
        }
      });
    });
}
