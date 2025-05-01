

const api_key = "f2ef5c18-3af9-4678-8223-b3cd919591e0";
let AQ_class = 'pm10subindex,pm25subindex,cosubindex,no2subindex,so2subindex,aqi' //等等用點擊按鈕的來加入變數
let AQ_class_list = ['pm10subindex','pm25subindex',"cosubindex","no2subindex","so2subindex","aqi"];

let currentSite = "中山";
let currentSiteId = "12";

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
async function chartRender(currentSiteId){
    let output_data = await AQ_data_format(AQ_class_list, currentSiteId);

    let Color = ["rgb(4, 150, 255)","rgb(255, 0, 0)","rgb(252, 143, 0)","rgb(59, 109, 189)","rgb(189, 59, 178)","rgb(113, 59, 189)"]
    let backgroundColor = ["rgba(4, 150, 255, 0.1)","rgba(255, 0, 0, 0.1)","rgba(252, 143, 0, 0.1)","rgba(59, 109, 189, 0.1)","rgba(189, 59, 178, 0.1)","rgba(113, 59, 189, 0.1)"]
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

    let option1= {
    responsive: true,
    aspectRatio: 2,
    scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                    font: {
                        family: "'Baloo 2', sans-serif",
                        size: 14
                    }
                },
                
                ticks: {
                    font: {
                        family: "'Baloo 2', sans-serif",
                        size: 12
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
                        family: "'Baloo 2', sans-serif",
                        size: 14
                    }
                },
                ticks: {
                    font: {
                        family: "'Baloo 2', sans-serif",
                        size: 12
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
                        family: "'Baloo 2', sans-serif",
                        size: 14
                    }
                },
                ticks: {
                    font: {
                        family: "'Baloo 2', sans-serif",
                        size: 12
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
                    family: "'Baloo 2', sans-serif",
                    size: 16
                }
            },
            // colors: {
            //     forceOverride: true
            // },
            legend: {
                labels: {
                    font: {
                        family: "'Baloo 2', sans-serif",
                        // weight:"bold",
                        size: 12
                    }
                }
            },
            tooltip: {
                bodyFont: {
                    family: "'Baloo 2', sans-serif",
                    size: 12
                },
                titleFont: {
                    family: "'Baloo 2', sans-serif",
                    size: 12
                },
                xAlign: 'center',
                yAlign: 'bottom',
                titleAlign: 'center',
            },
        },
        font:{
            family: "'Baloo 2', sans-serif",
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
            padding: 10
        }
    }

    //如果圖表已經有存在的話
    if (myChart) {
        myChart.data.labels = labels;
        myChart.data.datasets = datasets;
        myChart.update(); // 更新圖表
    } else {
        chartDomRender() //新增放圖表的位置
        const config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
                options:option1
            };

        let canvas_dom = document.querySelector('#canvas_dom');
        myChart = new Chart(canvas_dom, config);
            }

    }


export default chartRender;


// checkbox
async function AQ_class_checkbox_render(){
    let AQ_class_name = ['PM10','PM2.5',"CO","CO2","SO2","AQI"];

    let checkbox_group = document.createElement("div");
    checkbox_group.className='checkbox_group';
    document.querySelector(".chart").appendChild(checkbox_group)

    // AQ_class_list
    for(let i=0; i < AQ_class_list.length; i++){
        let checkbox = document.createElement("input")
        checkbox.type='checkbox';
        checkbox.className='AQ_class_select';
        checkbox.id= `AQ_class_select_${i}`;
        checkbox.value=AQ_class_list[i];
        checkbox.name='AQ_class_select';
        checkbox.checked = true;
        document.querySelector(".checkbox_group").appendChild(checkbox);
    
        let checkbox_label = document.createElement("label");
        checkbox_label.htmlFor = `AQ_class_select_${i}`;
        checkbox_label.id = `checkbox_label_${i}`;
        checkbox_label.className = "checkbox_label";
        document.querySelector(".checkbox_group").appendChild(checkbox_label);
    
        let checkbox_span = document.createElement("spqn");
        checkbox_span.htmlFor = `AQ_class_select_${i}`;
        checkbox_span.className = "checkbox_span";
        checkbox_span.textContent=`✅ ${AQ_class_name[i]}`
        checkbox_span.classList.add('active')
        document.querySelector(`#checkbox_label_${i}`).appendChild(checkbox_span);

        checkbox.addEventListener('change', async() => {
            await AQ_class_checkbox_update()
            let checked_class_num = document.querySelectorAll('input[name="AQ_class_select"]:checked');

            chartRender(currentSiteId)

            if (checkbox.checked) {
                checkbox_span.classList.add('active');
                let click_name = checkbox_span.textContent
                // checkbox_span.textContent=`✅ ${click_name}`
                checkbox_span.textContent=checkbox_span.textContent.replace("❌","✅")

            } else {
                checkbox_span.classList.remove('active');
                checkbox_span.textContent=checkbox_span.textContent.replace("✅","❌")
            }
            // 剩下一個
            if(checked_class_num.length==1){
                checked_class_num[0].disabled = true;
            }else{
                
                checked_class_num.forEach((checked) => {
                    checked.disabled = false;
                });
            }

        });

    }
}

function AQ_class_checkbox_update(){
    let checked_value = [];
    let checkboxes = document.querySelectorAll('input[name="AQ_class_select"]:checked');
    checkboxes.forEach((checkbox) => {
      checked_value.push(checkbox.value);
    });
    AQ_class_list = checked_value
    AQ_class = checked_value.join(',');
}

AQ_class_checkbox_render()

