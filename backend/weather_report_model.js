const mongoose = require('mongoose')

const { ObjectId } = require('mongoose').SchemaTypes

const schema = new mongoose.Schema({
	temp: {
		type: {
      value: Number,
      units: String
    },
	},
	observation_time: {
		type: {
      value: String
    },
	},
})

const weather_reports = mongoose.model('weather_reports', schema)
module.exports = weather_reports