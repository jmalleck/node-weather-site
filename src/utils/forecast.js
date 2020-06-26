const request = require('request');

const forecast = (lat, lon, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=9246a7d2f3168ba73dd08087daac118f&query=' + lat + ',' + lon;
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!');
        } else if (body.error) {
            callback('Unable to find location!');
        } else {
            callback(undefined, body.current.weather_descriptions[0] + '.\nIt is currently ' + body.current.temperature + ' degrees out, and it feels like ' + body.current.feelslike +' degrees out. The humidity is ' + body.current.humidity + ' percent. The wind speed is ' + body.current.wind_speed + ' km/h.');
        }
    });
};

module.exports = forecast;