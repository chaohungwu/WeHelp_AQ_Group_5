

const api_key = "f2ef5c18-3af9-4678-8223-b3cd919591e0";
let AQ_class = 'pm10subindex,pm25subindex,cosubindex,no2subindex,so2subindex,aqi' //等等用點擊按鈕的來加入變數
let AQ_class_list = ['pm10subindex','pm25subindex',"cosubindex","no2subindex","so2subindex","aqi"];
let currentSite = "中山";

let myChart = null;
let AQ_class_showText = {
    "pm10subindex":"PM10",
    "pm25subindex":"PM2.5",
    "cosubindex":"CO",
    "no2subindex":"NO2",
    "so2subindex":"SO2",
    "aqi":"AQI",
}

// 1. 取得空品資料
async function get_history_AQ_data(AQ_class,currentSiteId){
    let response = await fetch(`https://data.moenv.gov.tw/api/v2/aqx_p_434?api_key=${api_key}&limit=7&filters=SiteId,EQ,${currentSiteId}&fields=SiteName,${AQ_class},monitordate&sort=monitordate desc`)
    let AQ_data = await response.json();
    return AQ_data
}


// 2. 將空品資料做格式整理
async function AQ_data_format(AQ_class_list, currentSiteId){
    let AQ_data = await get_history_AQ_data(AQ_class,currentSiteId);
    // console.log(AQ_data)
    let date_list = [];
    let  value_list =[];

    // 日期資料
    for(let i=0; i < 7; i++){
        date_list.push(AQ_data.records[i]['monitordate'])
    }

    // 汙染物數值
    for(let n=0; n<AQ_class_list.length; n++){
        let value=[]
        for(let n2=0; n2<7; n2++){
            value.push(AQ_data.records[n2][AQ_class_list[n]]) //汙染物類別
        }
        value_list.push(value) //汙染物數值array
    }
    let AQ_class_showText = {
                            "pm10subindex":"PM10",
                            "pm25subindex":"PM2.5",
                            "cosubindex":"CO",
                            "no2subindex":"NO2",
                            "so2subindex":"SO2",
                            "aqi":"AQI",
        }
    let AQ_class_showText_list=[]
    AQ_class_list = AQ_class.split(",")

    AQ_class_list.forEach(AQ_class => {
        if (AQ_class_showText[AQ_class]) {
            currentSite = document.querySelector("#site").value
            AQ_class_showText_list.push(`${currentSite}-${AQ_class_showText[AQ_class]}`);
        }
    });


    let output_data = {
        "AQ_class_showText":AQ_class_showText_list,
        "AQ_class_list":AQ_class_list,
        "date_list":date_list,
        "value_list":value_list,
    };
    return output_data
}


// 3. 用dom方式新增圖表
async function chartDomRender(){
    let canvas_dom = document.createElement("canvas")
    canvas_dom.id='canvas_dom'
    let canvas_outside_dom = document.createElement("div")
    document.querySelector('.chart').appendChild(canvas_outside_dom)
    canvas_outside_dom.className='canvas_chart'
    document.querySelector('.canvas_chart').appendChild(canvas_dom)
}


// 4. 繪製折線圖(資料label,空品資料)
async function chartRender(currentSite){
    let output_data = await AQ_data_format(AQ_class_list, currentSite);

    let Color = ["rgb(113, 59, 189)","rgb(59, 163, 189)","rgb(189, 133, 59)","rgb(59, 59, 189)","rgb(189, 59, 178)","rgb(10, 10, 10)"]
    let backgroundColor = ["rgba(113, 59, 189, 0.1)","rgba(59, 163, 189, 0.1)","rgba(189, 133, 59, 0.1)","rgba(59, 59, 189, 0.1)","rgba(189, 59, 178, 0.1)","rgba(10, 10, 10, 0.1)"]

    let datasets = [];
    for(let n=0; n<output_data['AQ_class_list'].length; n++){
        let data = {
                    label: output_data['AQ_class_showText'][n], //數值名稱
                    data: output_data["value_list"][n].reverse(),
                    fill: true, // 折線下方是否填充顏色
                    backgroundColor:backgroundColor[n], // 折線下方填充的顏色
                    borderColor: Color[n],// 折線的顏色
                    tension: 0.5 //兩點間曲率
        };
    datasets.push(data)
    }

    const labels = output_data["date_list"].reverse();

    //如果圖表已經有存在的話
    if (myChart) {
        myChart.data.labels = labels;
        myChart.data.datasets = datasets;
        myChart.update(); // 更新圖表
    } else {
        await chartDomRender() //新增放圖表的位置
        const config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                aspectRatio: 2,
                scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date',
                                font: {
                                    size: 16
                                }
                            },
                            
                            ticks: {
                                font: {
                                    size: 14
                                }
                            },
                            grid: {
                                display: false
                            },
                        },

                        y: {
                            title: {
                                display: true,
                                text: 'ppb',
                                font: {
                                    size: 16
                                }
                            },
                            ticks: {
                                font: {
                                    size: 14
                                }
                            },
                            position: 'left',
                            beginAtZero: true,
                            // suggestedMin: 0,
                        },
                        
                        y1: {
                            title: {
                                display: true,
                                text: 'μg/m3',
                                font: {
                                    size: 16
                                }
                            },
                            ticks: {
                                font: {
                                    size: 14
                                }
                            },
                            grid: {
                                display: false
                            },
                            position: 'right',
                            beginAtZero: true,
                            // suggestedMin: 0,
                        }
                    },
                    plugins: {
                        title: {
                            display: false,
                            text: '折線圖',
                            font: {
                                size: 20
                            }
                        },
                        // colors: {
                        //     forceOverride: true
                        // },
                        legend: {
                            labels: {
                                font: {
                                    size: 18
                                }
                            }
                        },
                        tooltip: {
                            bodyFont: {
                                size: 16
                            },
                            titleFont: {
                                size: 16
                            },
                            xAlign: 'center',
                            yAlign: 'bottom',
                            titleAlign: 'center',
                        },
                    },
                    font:{
                        family: "'Noto Sans TC', sans-serif",
                    },
                    elements: {
                        
                        line: {
                            borderCapStyle: "round",
                            cubicInterpolationMode: 'monotone',
                            borderWidth: 2,
                        },
                        point: {
                            pointStyle: true,
                        }
                    },
                    interaction: {
                        intersect: false,
                    },
                    layout: {
                        padding: 20
                    }
                }
            };

        let canvas_dom = document.querySelector('#canvas_dom');
        myChart = new Chart(canvas_dom, config);
    }
}

// 更新站點資料時做圖表更換
// async function chart_get_site(){
//     // 換測站
//     let site_select = document.getElementById('site');
//     site_select.addEventListener('change', function (){
//         currentSite = site_select.value;
//         chartRender(currentSite)
//     })

//     // 換縣市
//     let County_select = document.getElementById('county');
//     County_select.addEventListener('change', function (){
//         site_select = document.getElementById('site');
//         let currentSite = site_select.value;
//         chartRender(currentSite)
//     })

// }
// chart_get_site()
export default chartRender;



// radio


