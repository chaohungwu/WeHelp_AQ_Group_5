export function getColorByAQI(aqi) {
  const res = { iconUrlDefault: "", iconUrlSelected: "", color: "" };

  if (aqi <= 50) {
    res.iconUrlDefault = "./static/img/green_default.png";
    res.iconUrlSelected = "./static/img/green_selected.png";
    res.color = "#008001";
  } else if (aqi <= 100) {
    res.iconUrlDefault = "./static/img/yellow_default.png";
    res.iconUrlSelected = "./static/img/yellow_selected.png";
    res.color = "#FFD500";
  } else if (aqi <= 150) {
    res.iconUrlDefault = "./static/img/orange_default.png";
    res.iconUrlSelected = "./static/img/orange_selected.png";
    res.color = "#FF8001";
  } else if (aqi <= 200) {
    res.iconUrlDefault = "./static/img/red_default.png";
    res.iconUrlSelected = "./static/img/red_selected.png";
    res.color = "#FF0000";
  } else if (aqi <= 300) {
    res.iconUrlDefault = "./static/img/purple_default.png";
    res.iconUrlSelected = "./static/img/purple_selected.png";
    res.color = "#4F009A";
  } else if (aqi <= 500) {
    res.iconUrlDefault = "./static/img/dark-red_default.png";
    res.iconUrlSelected = "./static/img/dark-red_selected.png";
    res.color = "#4F0000";
  } else {
    res.iconUrlDefault = "./static/img/gray_default.png";
    res.iconUrlSelected = "./static/img/gray_selected.png";
    res.color = "#9B9B9B";
  }
  return res;
}
