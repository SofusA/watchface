var getImageId = require("./symbolMap");
var latest = require("./latestData");
var fetchWeather = require("./weather");

function sendDataToPebble(temp, icon_code, uv, prec, min, max) {
  var icon = getImageId(icon_code);

  Pebble.sendAppMessage({
    WEATHER_TEMPERATURE: temp,
    WEATHER_ICON: icon,
    WEATHER_UV: uv,
    WEATHER_PRECIPITATION: prec,
    WEATHER_MIN: min,
    WEATHER_MAX: max,
  });
}

function maybeSend() {
  var d = latest.latestData;
  if (
    d.temp !== null &&
    d.icon_code !== null &&
    d.uv !== null &&
    d.precipitation !== null &&
    d.min !== null &&
    d.max !== null
  ) {
    sendDataToPebble(d.temp, d.icon_code, d.uv, d.precipitation, d.min, d.max);
  }
}

function requestWeather() {
  navigator.geolocation.getCurrentPosition(function (pos) {
    latest.reset();
    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;

    fetchWeather(lat, lon, maybeSend);
  });
}

Pebble.addEventListener("ready", function () {
  requestWeather();
});

Pebble.addEventListener("appmessage", function () {
  requestWeather();
});
