var utils = require('./utils');
var latest = require('./latestData');

function fetchSunForDate(lat, lon, dateStr, cb) {
  var url = "https://api.met.no/weatherapi/sunrise/3.0/sun" +
    "?lat=" + encodeURIComponent(lat) +
    "&lon=" + encodeURIComponent(lon) +
    "&date=" + encodeURIComponent(dateStr);

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.timeout = 15000;
  xhr.setRequestHeader("Accept", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var data = JSON.parse(xhr.responseText);
          var sr = data && data.properties && data.properties.sunrise && data.properties.sunrise.time;
          var ss = data && data.properties && data.properties.sunset && data.properties.sunset.time;
          cb(null, { sunriseIso: sr || null, sunsetIso: ss || null });
        } catch (err) {
          cb(err);
        }
      } else {
        cb(new Error("HTTP " + xhr.status));
      }
    }
  };
  xhr.onerror = function () { cb(new Error("network")); };
  xhr.ontimeout = function () { cb(new Error("timeout")); };
  xhr.send();
}

function chooseNextEventToday(sunriseIso, sunsetIso) {
  var now = new Date();
  var sr = sunriseIso ? utils.parseIsoToDate(sunriseIso) : null;
  var ss = sunsetIso ? utils.parseIsoToDate(sunsetIso) : null;

  if (sr && now < sr) {
    return utils.formatIsoToLocalHHMM(sunriseIso);
  }
  if (ss && now < ss) {
    return utils.formatIsoToLocalHHMM(sunsetIso);
  }
  return null;
}

function fetchSunNextEvent(lat, lon, maybeSend) {
  var today = new Date();
  var todayStr = utils.toYYYYMMDD(today);

  fetchSunForDate(lat, lon, todayStr, function (err, todayData) {
    if (err || !todayData) {
      var tmrStr = utils.toYYYYMMDD(new Date(today.getTime() + 86400000));
      fetchSunForDate(lat, lon, tmrStr, function (err2, tmrData) {
        if (!err2 && tmrData && tmrData.sunriseIso) {
          latest.latestData.sunEventStr = utils.formatIsoToLocalHHMM(tmrData.sunriseIso);
        } else {
          latest.latestData.sunEventStr = '--:--';
        }
        maybeSend();
      });
      return;
    }

    var eventToday = chooseNextEventToday(todayData.sunriseIso, todayData.sunsetIso);
    if (eventToday) {
      latest.latestData.sunEventStr = eventToday;
      maybeSend();
      return;
    }

    var tomorrow = new Date(today.getTime() + 86400000);
    var tomorrowStr = utils.toYYYYMMDD(tomorrow);

    fetchSunForDate(lat, lon, tomorrowStr, function (err2, tmrData) {
      if (!err2 && tmrData && tmrData.sunriseIso) {
        latest.latestData.sunEventStr = utils.formatIsoToLocalHHMM(tmrData.sunriseIso);
      } else if (tmrData && tmrData.sunsetIso) {
        latest.latestData.sunEventStr = utils.formatIsoToLocalHHMM(tmrData.sunsetIso);
      } else {
        latest.latestData.sunEventStr = '--:--';
      }
      maybeSend();
    });
  });
}

module.exports = fetchSunNextEvent;
