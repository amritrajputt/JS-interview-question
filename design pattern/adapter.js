const foreignWeatherApi = {
    fetchWeather(city) {
        return {
            city,
            tempF: 73,
            windSpeedMPH: 5,
            condition: "partly_cloud"
        }
    }
}

class weatherAdapter {
    constructor(foreignWeatherApi) {
        this._api = foreignWeatherApi
    }
    fetchWeather(city) {
        const raw = this._api.fetchWeather(city)
        return {
            city: city,
            tempCel: Math.round((raw.tempF - 32) * (5 / 9)),
            windSpeedKMPH: Math.round(raw.windSpeedMPH * 1.6),
            condition:raw.condition
        }
    }
}

const weather = new weatherAdapter(foreignWeatherApi)

const report = weather.fetchWeather("lucknow")
console.log(report);
