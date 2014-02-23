var Promise = require('bluebird');

exports.mongoExec = function (query) {
  return invoke(query, 'exec');
}

exports.mongoSaveOne = function (model) {
  var promise =
    invoke(model, 'save')
    .spread(function (model, rowsCount) {
      return model;
    });

  return promise;
}

function invoke(obj, methodName) {
  return Promise.promisify(obj[methodName], obj).call(obj);
}

exports.invoke = invoke;