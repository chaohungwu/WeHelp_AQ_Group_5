


async function get_AQdata() {
    let response = await fetch(`https://data.moenv.gov.tw/api/v2/aqx_p_432?api_key=9e565f9a-84dd-4e79-9097-d403cae1ea75&limit=1000&sort=ImportDate%20desc&format=JSON`,
        {
            method:'GET',
        })
    let AQ_data = await response.json();
    console.log(AQ_data)
    
}

get_AQdata()




async function get_AQdata() {
    let response = await fetch(`https://data.moenv.gov.tw/api/v2/aqx_p_432?api_key=9e565f9a-84dd-4e79-9097-d403cae1ea75&limit=1000&sort=ImportDate%20desc&format=JSON`,
        {
            method:'GET',
        })
    let AQ_data = await response.json();
    console.log(AQ_data)
    
}

get_AQdata()



async function chart_view() {
    // 用dom方式新增圖表
    let canvas_dom = document.createElement("canvas")
    let ctx = document.querySelector('.chart');
    ctx.appendChild(canvas_dom)

    const labels = ['一月份', '二月份', '三月份','四月份', '五月份', '六月份', '七月份'];  // 设置 X 轴上对应的标签
    const data = {
    labels: labels,
    datasets: [{
            label: '我的折線圖',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false, // 折線下方是否填充顏色
            backgroundColor:"rgba(18, 18, 189, 0.1)", // 折線下方填充的顏色
            borderColor: 'rgb(19, 61, 61)', // 折線的顏色
            tension: 0.5 //兩點間曲率
        },{
            label: '我的折線圖2',
            data: [30, 22, 70, 31, 8, 43, 91],
            fill: true, // 折線下方是否填充顏色
            backgroundColor:"rgba(228, 115, 34, 0.1)", // 折線下方填充的顏色
            borderColor: 'rgb(228, 115, 34)', // 折線的顏色
            tension: 0.1 //兩點間曲率
        }]
        };

    const config = {
    type: 'line', // 设置图表类型
    data: data,
    };
    const myChart = new Chart(canvas_dom, config);
}

chart_view()


