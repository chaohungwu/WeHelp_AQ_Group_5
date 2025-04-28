


async function get_AQdata() {
    let response = await fetch(`https://data.moenv.gov.tw/api/v2/aqx_p_432?api_key=9e565f9a-84dd-4e79-9097-d403cae1ea75&limit=1000&sort=ImportDate%20desc&format=JSON`,
        {
            method:'GET',
        })
    let AQ_data = await response.json();
    console.log(AQ_data)
    
}

get_AQdata()






