const BASE_URL = 'http://localhost:3000/api'
axios.get(BASE_URL + '/weather_reports').then(res => {
  console.log(res.data);
  let tBody = document.querySelector("#weather-reports-table tbody")
  let index = 0
  let reports = res.data
  reports = reports.sort((a,b) => {
    if(moment(a.observation_time.value).format('X') > moment(b.observation_time.value).format('X')) return 1
    if(moment(a.observation_time.value).format('X') < moment(b.observation_time.value).format('X')) return -1
    return 0
  })
  reports.forEach(report => {

    /* OPTIONAL */
    /* If you dont want to use moment or if the DAY & NIGHT range is different from std. */
    // let time = report.observation_time.value.split("T")[1].substr(0,2)
    // time = isNaN(parseInt(time)) ? 0 : parseInt(time)

    if(index > 0){
      let prevDate = moment(reports[index-1].observation_time.value).format("YYYY-MM-DD A")
      let currDate = moment(report.observation_time.value).format("YYYY-MM-DD A")
      console.log(prevDate, currDate);
      if(prevDate == currDate) {
        index++
        return
      }
    }

    let reportDate = moment(report.observation_time.value).format("YYYY-MM-DD A (HH:mm)").replace("AM", "NIGHT").replace("PM","DAY")
    let reportTemperature = report.temp.value + ' celsius'

    
    let tr = document.createElement('tr')
    tr.innerHTML = `
    <td>${reportDate}</td>
    <td>${reportTemperature}</td>
    `
    
    tBody.appendChild(tr)
    
    index ++
  })
})