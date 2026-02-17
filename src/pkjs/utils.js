function toYYYYMMDD(d) {
  var y = d.getFullYear();
  var m = ('0' + (d.getMonth() + 1)).slice(-2);
  var day = ('0' + d.getDate()).slice(-2);
  return y + '-' + m + '-' + day;
}

function parseIsoToDate(str) {
  var d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function formatIsoToLocalHHMM(str) {
  var d = new Date(str);
  if (isNaN(d.getTime())) return '--:--';
  var h = d.getHours();
  var m = d.getMinutes();
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}

module.exports = {
  toYYYYMMDD: toYYYYMMDD,
  parseIsoToDate: parseIsoToDate,
  formatIsoToLocalHHMM: formatIsoToLocalHHMM
};
