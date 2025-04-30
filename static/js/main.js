function addScript(url) {
  let script_dom = document.createElement("script");
  script_dom.defer = true;
  script_dom.setAttribute("src", url);
  document.querySelector("head").appendChild(script_dom);
}

addScript("./static/js/wu_test.js");

import { showPollutantsBoard } from "./board.js";

const apiKey = "b9e37fc7-b00e-4759-9315-95df2f1f918d";
let currentSiteId = "12";
initAll();

async function initAll() {
  const classifySitesData = await classifySites();
  insertCountyIntoSelect(classifySitesData);
  document.querySelector('select[name="county"]').value = "臺北市";
  let siteArr = classifySitesData["臺北市"];
  insertSitesIntoSelect(siteArr);
  document.querySelector('select[name="site"]').value = "中山";
  currentSiteId = findSiteIdByName("中山", classifySitesData);
  initMain(currentSiteId);

  document.getElementById("county").addEventListener("change", async (e) => {
    let siteArr = classifySitesData[e.target.value];
    insertSitesIntoSelect(siteArr);
    let currentSiteId = siteArr[0].siteid;
    // currentSiteId = findSiteIdByName(currentSite, classifySitesData);
    initMain(currentSiteId);
  });
  document.getElementById("site").addEventListener("change", async (e) => {
    let currentSite = e.target.value;
    currentSiteId = findSiteIdByName(currentSite, classifySitesData);
    initMain(currentSiteId);
  });
}

// get sites data
async function getAllSites() {
  let sitesData = await fetch(
    "https://data.moenv.gov.tw/api/v2/aqx_p_07?&api_key=" + apiKey
  );
  sitesData = await sitesData.json();
  return sitesData;
}

// classifySitesData = { 縣市: [ { sitename, siteid } ] }
// 例如: {...,嘉義縣:[{sitename:"朴子",siteid:'40'}, {sitename: '新港', siteid: '39'}],...}
async function classifySites() {
  let sitesData = await getAllSites();
  let classifySitesData = {};
  sitesData.records.forEach((site) => {
    const siteInfo = {
      sitename: site.sitename,
      siteid: site.siteid,
    };
    if (!classifySitesData[site.county]) {
      classifySitesData[site.county] = [siteInfo];
    } else {
      classifySitesData[site.county].push(siteInfo);
    }
  });
  return classifySitesData;
}

// County-Select-Options Render Function
function insertCountyIntoSelect(classifySitesData) {
  // const classifySitesData = await classifySites();
  let countySelect = document.getElementById("county");
  let countyData = Object.keys(classifySitesData);
  countyData.forEach((county) => {
    let option = document.createElement("option");
    option.value = county;
    option.innerText = county;
    countySelect.appendChild(option);
  });
}

// Site-Selects-Options Render Function
function insertSitesIntoSelect(siteArr) {
  let siteSelect = document.getElementById("site");
  siteSelect.replaceChildren();
  siteArr.forEach((site) => {
    let option = document.createElement("option");
    option.value = site.sitename;
    option.innerText = site.sitename;
    option.dataset.siteid = site.siteid;
    siteSelect.appendChild(option);
  });
}

function findSiteIdByName(currentSite, classifySitesData) {
  for (let county in classifySitesData) {
    let sitesInfo = classifySitesData[county];
    for (let siteInfo of sitesInfo) {
      if (siteInfo && siteInfo.sitename === currentSite && siteInfo.siteid) {
        return siteInfo.siteid;
      }
    }
  }
  return null;
}

// 這邊要放地圖上點點的 onclick 事件，觸發initMain() 重新渲染大家的程式碼

// 這邊放需要使用 currentSiteId 渲染的功能
function initMain(currentSiteId) {
  showPollutantsBoard(apiKey, currentSiteId);
  // 例如：renderTable(currentSiteId)
  // 例如：renderMap(currentSiteId)
}
