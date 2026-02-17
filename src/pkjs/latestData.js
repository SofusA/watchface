var latestData = {
  temp: null,
  icon_code: null,
  uv: null,
  precipitation: null,
  sunEventStr: null
};

function reset() {
  latestData.temp = null;
  latestData.icon_code = null;
  latestData.uv = null;
  latestData.precipitation = null;
  latestData.sunEventStr = null;
}

module.exports = {
  latestData: latestData,
  reset: reset
};
