/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	/**
	 * Copyright 2024 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	(function(p) {
	  if (!p === undefined) {
	    console.error('Pebble object not found!?');
	    return;
	  }
	
	  // Aliases:
	  p.on = p.addEventListener;
	  p.off = p.removeEventListener;
	
	  // For Android (WebView-based) pkjs, print stacktrace for uncaught errors:
	  if (typeof window !== 'undefined' && window.addEventListener) {
	    window.addEventListener('error', function(event) {
	      if (event.error && event.error.stack) {
	        console.error('' + event.error + '\n' + event.error.stack);
	      }
	    });
	  }
	
	})(Pebble);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

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


/***/ })
/******/ ]);
//# sourceMappingURL=pebble-js-app.js.map