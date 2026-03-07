var latestData = {
  temp: null,
  icon_code: null,
  uv: null,
  precipitation: null,
  min: null,
  max: null,
};

function reset() {
  latestData.temp = null;
  latestData.icon_code = null;
  latestData.uv = null;
  latestData.precipitation = null;
  latestData.min = null;
  latestData.max = null;
}

module.exports = {
  latestData: latestData,
  reset: reset,
};
