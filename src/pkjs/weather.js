var latest = require('./latestData');

function fetchWeather(lat, lon, maybeSend) {
  var url = "https://api.met.no/weatherapi/locationforecast/2.0/complete" +
    "?lat=" + lat + "&lon=" + lon;

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.timeout = 15000;
  xhr.setRequestHeader("Accept", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var data = JSON.parse(xhr.responseText);

          var t = data.properties.timeseries[0].data.instant.details.air_temperature;
          var uv = data.properties.timeseries[0].data.instant.details.ultraviolet_index_clear_sky;
          var icon = data.properties.timeseries[0].data.next_1_hours.summary.symbol_code;
          var prec = data.properties.timeseries[0].data.next_6_hours.details.precipitation_amount;

          latest.latestData.temp = Math.round(t);
          latest.latestData.icon_code = icon;
          latest.latestData.uv = Math.round(uv);
          latest.latestData.precipitation = Math.round(prec);

          maybeSend();
        } catch (err) {
          console.log("JSON parse error: " + err);
        }
      }
    }
  };

  xhr.send();
}

module.exports = fetchWeather;
