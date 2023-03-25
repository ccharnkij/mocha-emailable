/**
 * Retrieve the value of a user supplied option.
 * Falls back to `defaultValue`
 * Order of precedence
 *  1. User-supplied option
 *  2. Environment variable
 *  3. Default value
 *
 * @param {string} optToGet  Option name
 * @param {object} options  User supplied options object
 * @param {boolean} isBool  Treat option as Boolean
 * @param {string|boolean} defaultValue  Fallback value
 *
 * @return {string|boolean}  Option value
 */
function _getOption(optToGet, options, isBool, defaultValue) {
  const envVar = `MOCHAWESOME_${optToGet.toUpperCase()}`;
  if (options && typeof options[optToGet] !== 'undefined') {
    return isBool && typeof options[optToGet] === 'string'
      ? options[optToGet] === 'true'
      : options[optToGet];
  }
  if (typeof process.env[envVar] !== 'undefined') {
    return isBool ? process.env[envVar] === 'true' : process.env[envVar];
  }
  return defaultValue;
}

module.exports = function (opts) {
  const reporterOpts = (opts && opts.reporterOptions) || {};

  return {
    reportFilename: _getOption(
      'reportFilename',
      reporterOpts,
      false,
      'result-email'
    ),
    reportDir: _getOption('reportDir', reporterOpts, false, './mocha-results'),
    consoleReporter: _getOption('consoleReporter', reporterOpts, false, 'spec'),
  };
};
