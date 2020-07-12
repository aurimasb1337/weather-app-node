var request = require("request");
var express = require("express");
const cors = require('cors');
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const WEATHER_REPORTS = require("./weather_report_model")

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/api/weather_reports", async (req, res) => {
  try{
    let reports = await WEATHER_REPORTS.find({})
    return res.status(200).json(reports)
  }catch(ex){
    console.log('ERROR, /api/weather_reports', ex);
    return res.status(400).send('Server Error!')
  }
})

app.listen(port, () => {
    console.log("Server listening on port " + port);
});

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;mongoose.connect("mongodb://localhost:27017/node-weather");

var tempSchema = new mongoose.Schema({
    temp: String,
    date: Date
});

var tempData = mongoose.model("User", tempSchema);
app.post("/addname", (req, res) => {
    var myData = new tempData(req.body);
    myData.save()
        .then(item => {
            res.send("item saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});
  function getMonthHistory() {
    let dateRange = []
    for (var i = 1; i <= 31; i = i + 1) // for loop to get 30 days data
    {
      var sTime = new Date(new Date().getTime() - i * (24 * 60 * 60 * 1000));
      var endTime = new Date(sTime.getTime() + 1 * (24 * 60 * 60 * 1000));
      // apiCall(sTime,endTime);
      dateRange.push({
        day: i,
        sTime,
        endTime
      })
      console.log(sTime, endTime);
    }
    Promise.all(
      dateRange.map(d => {
        return apiCall(d.sTime, d.endTime)
      })
    ).then(async results => {
      await WEATHER_REPORTS.remove({})
      results.forEach(result => {
        let reports = JSON.parse(result)
        reports.map(async report => {
          // console.log(JSON.parse(result));
          let obj = {
            temp: report.temp,
            observation_time: report.observation_time
          }
          await new WEATHER_REPORTS(obj).save()
        })
      })
    })
  }
  function apiCall(sTime, endTime){
    var options = {
        method: 'GET',
        url: 'https://api.climacell.co/v3/weather/historical/station/temp', //24hrs per call max
        qs: {
            "fields": "temp",
            lat: '54.687157',
            lon: '25.279652',
            unit_system: 'si',
            start_time: sTime,
            end_time: endTime,
            apikey: 'H5VqtKy8PNXxqgBS33EggzRM6Q0e07ZT'
        }
    };

    return new Promise((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) reject(error);
        var result = JSON.parse(body);
        // console.log(result);
        resolve(body)
      });
    })
  }
  getMonthHistory()
  setInterval(()=>{
    getMonthHistory()
  }, 1000 * 60 * 60)