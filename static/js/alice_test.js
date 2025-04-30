document.querySelector(".map_content").innerHTML = `<div id="map" style="width: 600px; height: 700px;"></div>`;
renderMap(); 

function renderMap() {
  const map = L.map("map").setView([23.7, 120.9], 7);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const stationMap = {};

  fetch("https://data.moenv.gov.tw/api/v2/aqx_p_07?language=zh&api_key=b9e37fc7-b00e-4759-9315-95df2f1f918d")
    .then(res => res.json())
    .then(data => {
      data.records.forEach((station) => {
        const lat = parseFloat(station.twd97lat);
        const lon = parseFloat(station.twd97lon);
        const county = station.county;
        const name = station.sitename;
        const id = station.siteid;

        if (!isNaN(lat) && !isNaN(lon)) {
          const marker = L.marker([lat, lon])
            .addTo(map)
            .bindPopup(`<b>${name}</b>`);

          stationMap[id] = {
            county,
            name,
            lat,
            lon,
            marker,
            data: station
          };
        }
      });
    });
}

