;(function() {
  var parse = JSON.parse
  JSON.parse = function(s, f) {
    var ISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
    return parse(s, f ? f : function(_key, value) {
      return typeof value === 'string'
        ? ISO.exec(value) && new Date(value) || value
        : value;
    })
  }

  Date.prototype.toJSON = function () {
    return moment(this).format();
  }
}());
