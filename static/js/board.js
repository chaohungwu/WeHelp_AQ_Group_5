async function getAllAqiData(apiKey) {
  let allAqiData = await fetch(
    "https://data.moenv.gov.tw/api/v2/aqx_p_432?&api_key=" + apiKey
  );
  allAqiData = await allAqiData.json();
  return allAqiData;
}

export async function showPollutantsBoard(apiKey, currentSiteId) {
  let allAqiData = await getAllAqiData(apiKey);
  let aqiDataForSelectedSite = allAqiData.records.find(
    (record) => record.siteid == currentSiteId
  );
  renderPollutantsSum(aqiDataForSelectedSite);
  renderPollutantsTable(aqiDataForSelectedSite);
}

function renderPollutantsSum(aqiDataForSelectedSite) {
  const siteSumSection = document.getElementById("board_content_site_sum");
  siteSumSection.replaceChildren();

  //render site name
  let siteNameDiv = document.createElement("div");
  siteNameDiv.textContent = `${aqiDataForSelectedSite.county} / ${aqiDataForSelectedSite.sitename}測站`;
  siteNameDiv.classList.add("county_site_title");
  siteSumSection.appendChild(siteNameDiv);

  //render aqi circle
  let aqiDiv = document.createElement("div");
  let aqiTitle = document.createElement("div");
  let aqiNumber = document.createElement("div");
  let status = document.createElement("div");
  aqiTitle.textContent = "空氣品質指標";
  if (aqiDataForSelectedSite.aqi == "" || aqiDataForSelectedSite.aqi == null) {
    aqiNumber.textContent = "暫無資料";
  } else {
    aqiNumber.textContent = aqiDataForSelectedSite.aqi;
    if (aqiDataForSelectedSite.aqi < 51) {
      aqiDiv.style.border = "5px solid rgb(190, 230, 200)";
    } else if (
      aqiDataForSelectedSite.aqi > 50 &&
      aqiDataForSelectedSite.aqi < 101
    ) {
      aqiDiv.style.border = "5px solid rgb(240, 230, 120)";
    } else if (
      aqiDataForSelectedSite.aqi > 100 &&
      aqiDataForSelectedSite.aqi < 151
    ) {
      aqiDiv.style.border = "5px solid rgb(240, 190, 110)";
    } else if (
      aqiDataForSelectedSite.aqi > 150 &&
      aqiDataForSelectedSite.aqi < 201
    ) {
      aqiDiv.style.border = "5px solid rgb(230, 125, 60)";
    } else if (
      aqiDataForSelectedSite.aqi > 200 &&
      aqiDataForSelectedSite.aqi < 301
    ) {
      aqiDiv.style.border = "5px solid rgb(150, 120, 180)";
    } else if (
      aqiDataForSelectedSite.aqi > 300 &&
      aqiDataForSelectedSite.aqi < 501
    ) {
      aqiDiv.style.border = "5px solid rgb(150, 100, 0)";
    }
  }
  status.textContent = aqiDataForSelectedSite.status;
  aqiDiv.appendChild(aqiTitle);
  aqiDiv.appendChild(aqiNumber);
  aqiDiv.appendChild(status);
  aqiDiv.classList.add("aqi_div");
  aqiTitle.classList.add("aqi_title");
  aqiNumber.classList.add("aqi_value");
  status.classList.add("aqi_status");
  siteSumSection.appendChild(aqiDiv);
}

function renderPollutantsTable(aqiDataForSelectedSite) {
  const pollutantsBoardSection = document.getElementById(
    "board_content_pollutants"
  );
  pollutantsBoardSection.replaceChildren();
  const pollutantsItem = {
    O3: { "8 小時移動平均": "o3_8hr", 小時濃度: "o3", 單位: "ppb" },
    "PM2.5": { 移動平均: "pm2.5_avg", 小時濃度: "pm2.5", 單位: "μg/m3" },
    PM10: { 移動平均: "pm10_avg", 小時濃度: "pm10", 單位: "μg/m3" },
    CO: { "8 小時移動平均": "co_8hr", 小時濃度: "co", 單位: "ppb" },
    SO2: { 移動平均: "so2_avg", 小時濃度: "so2", 單位: "ppb" },
    NO2: { 移動平均: null, 小時濃度: "no2", 單位: "ppb" },
  };
  let pollutantsList = Object.keys(pollutantsItem);
  const template = document.getElementById("board_content_pollutant_template");

  pollutantsList.forEach((pollutant) => {
    let [moveKey, moveValue] = Object.entries(pollutantsItem[pollutant])[0];
    let [concentrationKey, concentrationValue] = Object.entries(
      pollutantsItem[pollutant]
    )[1];

    //render pollutants title & unit
    let section = template.content.cloneNode(true).children[0];
    let titleDiv = section.querySelector(".board_content_pollutant_title");
    let unitDiv = document.createElement("div");
    titleDiv.textContent = pollutant;
    unitDiv.textContent = `(${pollutantsItem[pollutant]["單位"]})`;
    unitDiv.classList.add("pollutant_unit");
    titleDiv.appendChild(unitDiv);

    //render move value
    let move = section.querySelector(".board_content_pollutant_move");
    let moveValueDiv = move.querySelector(".board_content_value");
    if (
      aqiDataForSelectedSite[moveValue] == null ||
      aqiDataForSelectedSite[moveValue] == ""
    ) {
      moveValueDiv.textContent = "N/A";
    } else {
      moveValueDiv.textContent = aqiDataForSelectedSite[moveValue];
    }
    let moveMeasuring = move.querySelector(".board_content_measuring");
    moveMeasuring.textContent = moveKey;

    //render concentration value
    let concentration = section.querySelector(
      ".board_content_pollutant_concentration"
    );
    let concentrationValueDiv = concentration.querySelector(
      ".board_content_value"
    );
    concentrationValueDiv.textContent =
      aqiDataForSelectedSite[concentrationValue];

    pollutantsBoardSection.appendChild(section);
  });

  //render update time
  let updateTime = document.createElement("div");
  updateTime.textContent = `資料最後更新時間：${aqiDataForSelectedSite["publishtime"]}`;
  updateTime.classList.add("last_update_time");
  pollutantsBoardSection.appendChild(updateTime);
}
