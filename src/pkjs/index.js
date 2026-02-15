function sendDataToPebble(temperature) {
  console.log('Sending data to pebble.');

  var message = {
    'WEATHER_TEMPERATURE': temperature,
  };

  Pebble.sendAppMessage(message,
    function(e) {
      console.log('Data sent successfully');
    },
    function(e) {
      console.log('Failed to send data: ' + e.error.message);
    }
  );
}

function fetchWeather(lat, lon) {
  const url =
    "https://api.met.no/weatherapi/locationforecast/2.0/compact" +
    "?lat=" + lat + "&lon=" + lon;

  console.log("Fetching weather: " + url);

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.timeout = 15000;
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("User-Agent", "PebbleWatchface");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log("HTTP readyState=4, status=" + xhr.status);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var data = JSON.parse(xhr.responseText);
          
          const temp =
            data.properties.timeseries[0].data.instant.details.air_temperature;

          var rounded = Math.round(temp);
          console.log("Parsed temp: " + rounded);
          sendDataToPebble(rounded);
          
        } catch (err) {
          console.log("JSON parse error: " + err);
        }
      } else {
        console.log("HTTP error, status=" + xhr.status + " body: " + xhr.responseText);
      }
    }
  };
  xhr.onerror = function () { console.log("XHR network error"); };
  xhr.ontimeout = function () { console.log("XHR timeout"); };
  xhr.send();
}


function requestWeather() {
  console.log("Requesting geolocation...");
  navigator.geolocation.getCurrentPosition(
    function(pos) {
      console.log("Got location: " + pos.coords.latitude + ", " + pos.coords.longitude);
      fetchWeather(pos.coords.latitude, pos.coords.longitude);
    },
    function(err) {
      console.log("Location error, using fallback (Copenhagen): " + JSON.stringify(err));
      // Fallback for emulator/dev
      fetchWeather(55.6761, 12.5683);
    },
    { timeout: 15000, maximumAge: 600000 }
  );
}

Pebble.addEventListener("ready", function() {
  console.log("PKJS ready");
  requestWeather();
  // Refresh every 30 minutes
  setInterval(requestWeather, 30 * 60 * 1000);
});

// Optional: let the watchface ping pkjs to force refresh
Pebble.addEventListener("appmessage", function(e) {
  console.log("AppMessage received from watch, refreshing weather");
  requestWeather();
});
