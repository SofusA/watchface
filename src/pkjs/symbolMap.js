var ImageId = require('./imageIds');

var SYMBOL_TO_IMAGE_ID = {
  clearsky_day: ImageId.IMAGE_SUNNY_DARK,
  clearsky_night: ImageId.IMAGE_CLEAR_NIGHT_DARK,
  clearsky_polartwilight: ImageId.IMAGE_CLEAR_NIGHT_DARK,

  fair_day: ImageId.IMAGE_PARTLY_CLOUDY_DARK,
  fair_night: ImageId.IMAGE_PARTLY_CLOUDY_NIGHT_DARK,
  fair_polartwilight: ImageId.IMAGE_PARTLY_CLOUDY_NIGHT_DARK,

  lightssnowshowersandthunder_day: ImageId.IMAGE_THUNDERSTORM_DARK,
  lightssnowshowersandthunder_night: ImageId.IMAGE_THUNDERSTORM_DARK,
  lightssnowshowersandthunder_polartwilight: ImageId.IMAGE_THUNDERSTORM_DARK,

  lightsnowshowers_day: ImageId.IMAGE_HEAVY_SNOW_DARK,
  lightsnowshowers_night: ImageId.IMAGE_HEAVY_SNOW_DARK,
  lightsnowshowers_polartwilight: ImageId.IMAGE_HEAVY_SNOW_DARK,

  heavyrainandthunder: ImageId.IMAGE_THUNDERSTORM_DARK,
  heavysnowandthunder: ImageId.IMAGE_THUNDERSTORM_DARK,
  rainandthunder: ImageId.IMAGE_THUNDERSTORM_DARK,

  heavysleetshowersandthunder_day: ImageId.IMAGE_THUNDERSTORM_DARK,
  heavysleetshowersandthunder_night: ImageId.IMAGE_THUNDERSTORM_DARK,
  heavysleetshowersandthunder_polartwilight: ImageId.IMAGE_THUNDERSTORM_DARK,

  heavysnow: ImageId.IMAGE_HEAVY_SNOW_DARK,

  heavyrainshowers_day: ImageId.IMAGE_HEAVY_RAIN_DARK,
  heavyrainshowers_night: ImageId.IMAGE_HEAVY_RAIN_DARK,
  heavyrainshowers_polartwilight: ImageId.IMAGE_HEAVY_RAIN_DARK,

  lightsleet: ImageId.IMAGE_RAIN_SNOW_DARK,
  heavyrain: ImageId.IMAGE_HEAVY_RAIN_DARK,

  lightrainshowers_day: ImageId.IMAGE_HEAVY_RAIN_DARK,
  lightrainshowers_night: ImageId.IMAGE_HEAVY_RAIN_DARK,
  lightrainshowers_polartwilight: ImageId.IMAGE_HEAVY_RAIN_DARK,

  heavysleetshowers_day: ImageId.IMAGE_RAIN_SNOW_DARK,
  heavysleetshowers_night: ImageId.IMAGE_RAIN_SNOW_DARK,
  heavysleetshowers_polartwilight: ImageId.IMAGE_RAIN_SNOW_DARK,
  lightsleetshowers_day: ImageId.IMAGE_RAIN_SNOW_DARK,
  lightsleetshowers_night: ImageId.IMAGE_RAIN_SNOW_DARK,
  lightsleetshowers_polartwilight: ImageId.IMAGE_RAIN_SNOW_DARK,

  snow: ImageId.IMAGE_HEAVY_SNOW_DARK,

  heavyrainshowersandthunder_day: ImageId.IMAGE_THUNDERSTORM_DARK,
  heavyrainshowersandthunder_night: ImageId.IMAGE_THUNDERSTORM_DARK,
  heavyrainshowersandthunder_polartwilight: ImageId.IMAGE_THUNDERSTORM_DARK,

  snowshowers_day: ImageId.IMAGE_HEAVY_SNOW_DARK,
  snowshowers_night: ImageId.IMAGE_HEAVY_SNOW_DARK,
  snowshowers_polartwilight: ImageId.IMAGE_HEAVY_SNOW_DARK,

  fog: ImageId.IMAGE_CLOUDY_DARK,

  snowshowersandthunder_day: ImageId.IMAGE_THUNDERSTORM_DARK,
  snowshowersandthunder_night: ImageId.IMAGE_THUNDERSTORM_DARK,
  snowshowersandthunder_polartwilight: ImageId.IMAGE_THUNDERSTORM_DARK,

  lightsnowandthunder: ImageId.IMAGE_THUNDERSTORM_DARK,
  heavysleetandthunder: ImageId.IMAGE_THUNDERSTORM_DARK,

  lightrain: ImageId.IMAGE_HEAVY_RAIN_DARK,
  rainshowersandthunder_day: ImageId.IMAGE_THUNDERSTORM_DARK,
  rainshowersandthunder_night: ImageId.IMAGE_THUNDERSTORM_DARK,
  rainshowersandthunder_polartwilight: ImageId.IMAGE_THUNDERSTORM_DARK,
  rain: ImageId.IMAGE_HEAVY_RAIN_DARK,
  lightsnow: ImageId.IMAGE_HEAVY_SNOW_DARK,

  lightrainshowersandthunder_day: ImageId.IMAGE_THUNDERSTORM_DARK,
  lightrainshowersandthunder_night: ImageId.IMAGE_THUNDERSTORM_DARK,
  lightrainshowersandthunder_polartwilight: ImageId.IMAGE_THUNDERSTORM_DARK,

  heavysleet: ImageId.IMAGE_RAIN_SNOW_DARK,
  sleetandthunder: ImageId.IMAGE_THUNDERSTORM_DARK,
  lightrainandthunder: ImageId.IMAGE_THUNDERSTORM_DARK,
  sleet: ImageId.IMAGE_RAIN_SNOW_DARK,

  lightssleetshowersandthunder_day: ImageId.IMAGE_THUNDERSTORM_DARK,
  lightssleetshowersandthunder_night: ImageId.IMAGE_THUNDERSTORM_DARK,
  lightssleetshowersandthunder_polartwilight: ImageId.IMAGE_THUNDERSTORM_DARK,

  lightsleetandthunder: ImageId.IMAGE_THUNDERSTORM_DARK,

  partlycloudy_day: ImageId.IMAGE_PARTLY_CLOUDY_DARK,
  partlycloudy_night: ImageId.IMAGE_PARTLY_CLOUDY_NIGHT_DARK,
  partlycloudy_polartwilight: ImageId.IMAGE_PARTLY_CLOUDY_NIGHT_DARK,

  sleetshowersandthunder_day: ImageId.IMAGE_THUNDERSTORM_DARK,
  sleetshowersandthunder_night: ImageId.IMAGE_THUNDERSTORM_DARK,
  sleetshowersandthunder_polartwilight: ImageId.IMAGE_THUNDERSTORM_DARK,

  rainshowers_day: ImageId.IMAGE_HEAVY_RAIN_DARK,
  rainshowers_night: ImageId.IMAGE_HEAVY_RAIN_DARK,
  rainshowers_polartwilight: ImageId.IMAGE_HEAVY_RAIN_DARK,

  snowandthunder: ImageId.IMAGE_THUNDERSTORM_DARK,

  sleetshowers_day: ImageId.IMAGE_RAIN_SNOW_DARK,
  sleetshowers_night: ImageId.IMAGE_RAIN_SNOW_DARK,
  sleetshowers_polartwilight: ImageId.IMAGE_RAIN_SNOW_DARK,

  cloudy: ImageId.IMAGE_CLOUDY_DARK,

  heavysnowshowersandthunder_day: ImageId.IMAGE_THUNDERSTORM_DARK,
  heavysnowshowersandthunder_night: ImageId.IMAGE_THUNDERSTORM_DARK,
  heavysnowshowersandthunder_polartwilight: ImageId.IMAGE_THUNDERSTORM_DARK,

  heavysnowshowers_day: ImageId.IMAGE_HEAVY_SNOW_DARK,
  heavysnowshowers_night: ImageId.IMAGE_HEAVY_SNOW_DARK,
  heavysnowshowers_polartwilight: ImageId.IMAGE_HEAVY_SNOW_DARK
};

function getImageIdFromSymbol(symbol) {
  if (!symbol || typeof symbol !== 'string') {
    return ImageId.IMAGE_QUESTION_DARK;
  }
  var key = symbol.trim();
  return SYMBOL_TO_IMAGE_ID[key];
}

module.exports = getImageIdFromSymbol;
