function addScript(url) {
  let script_dom = document.createElement("script");
  script_dom.defer = true;
  script_dom.setAttribute("src", url);
  document.querySelector("head").appendChild(script_dom);
}

addScript("./static/js/wu_test.js");
addScript("./static/js/alice_test.js");

const apiKey = "b9e37fc7-b00e-4759-9315-95df2f1f918d";
let currentSite = "中山";
InitSelects();
initMain(currentSite);

// get sites data
async function getAllSites() {
  let sitesData = await fetch(
    "https://data.moenv.gov.tw/api/v2/aqx_p_07?&api_key=" + apiKey
  );
  sitesData = await sitesData.json();
  return sitesData;
}

// classifySitesData:Dict {縣市:[測站]}
async function classifySites() {
  let sitesData = await getAllSites();
  let classifySitesData = {};
  sitesData.records.forEach((site) => {
    if (!Object.keys(classifySitesData).includes(site.county)) {
      classifySitesData[site.county] = [site.sitename];
    } else {
      classifySitesData[site.county].push(site.sitename);
    }
  });
  return classifySitesData;
}

// County-Select-Options Render Function
async function insertCountyIntoSelect() {
  const classifySitesData = await classifySites();
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
    option.value = site;
    option.innerText = site;
    siteSelect.appendChild(option);
  });
}

// init selects and set default
async function InitSelects() {
  await insertCountyIntoSelect();
  document.querySelector('select[name="county"]').value = "臺北市";
  const classifySitesData = await classifySites();
  let siteArr = classifySitesData["臺北市"];
  insertSitesIntoSelect(siteArr);
  document.querySelector('select[name="site"]').value = "中山";
}

// get current site and re-render on change
document.getElementById("county").addEventListener("change", async (e) => {
  const classifySitesData = await classifySites();
  let siteArr = classifySitesData[e.target.value];
  insertSitesIntoSelect(siteArr);
  currentSite = siteArr[0];
  initMain(currentSite);
});
document.getElementById("site").addEventListener("change", async (e) => {
  currentSite = e.target.value;
  initMain(currentSite);
});

// // 這邊放需要使用 currentSite 渲染的功能
async function initMain(currentSite) {
  console.log(currentSite);
  // 例如：renderTable(currentSite)
  // 例如：renderMap(currentSite)
}
