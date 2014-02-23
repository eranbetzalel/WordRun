exports.isDuplicateRecordError = function (err) {
  return err != null && err.cause != null && (err.cause.code === 11000 || err.cause.code === 11001);
}