var getImageId = require('./symbolMap');
var latest = require('./latestData');
var fetchWeather = require('./weather');
var fetchSunNextEvent = require('./sun');

function sendDataToPebble(temp, icon_code, uv, prec, sunEventStr) {
  var icon = getImageId(icon_code);

  Pebble.sendAppMessage({
    WEATHER_TEMPERATURE: temp,
    WEATHER_ICON: icon,
    WEATHER_UV: uv,
    WEATHER_PRECIPITATION: prec,
    SUN_EVENT: sunEventStr || '--:--'
  });
}

function maybeSend() {
  var d = latest.latestData;
  if (d.temp !== null &&
      d.icon_code !== null &&
      d.uv !== null &&
      d.precipitation !== null &&
      d.sunEventStr !== null) {

    sendDataToPebble(
      d.temp, d.icon_code, d.uv, d.precipitation, d.sunEventStr
    );
  }
}

function requestWeather() {
  navigator.geolocation.getCurrentPosition(function (pos) {
    latest.reset();
    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;

    fetchWeather(lat, lon, maybeSend);
    fetchSunNextEvent(lat, lon, maybeSend);
  });
}

Pebble.addEventListener("ready", function () {
  requestWeather();
});

Pebble.addEventListener("appmessage", function () {
  requestWeather();
});
