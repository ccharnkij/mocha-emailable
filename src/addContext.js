const isObject = require('lodash.isobject');
const isEmpty = require('lodash.isempty');
const chalk = require('chalk');
const stringify = require('json-stringify-safe');

const errorPrefix = 'Error adding context:';
const ERRORS = {
  INVALID_ARGS: `${errorPrefix} Invalid arguments.`,
  INVALID_TEST: `${errorPrefix} Invalid test object.`,
  INVALID_CONTEXT: `${errorPrefix} Expected a string.`,
};

/**
 * HELPER FUNCTIONS
 */

/* istanbul ignore next */
function log(msg, level) {
  const logMethod = console[level] || console.log;
  let out = msg;
  if (typeof msg === 'object') {
    out = stringify(msg, null, 2);
  }
  logMethod(`[${chalk.gray('mochawesome')}] ${out}\n`);
}

function _isValidContext(ctx) {
  /*
   * Context is valid if any of the following are true:
   * 1. Type is string and it is not empty
   * 2. Type is object and it has properties `title` and `value` and `title` is not empty
   */
  if (!ctx) return false;
  return typeof ctx === 'string' && !isEmpty(ctx);
}

/**
 * Add context to the test object so it can
 * be displayed in the mochawesome report
 *
 * @param {Object} test object
 * @param {String|Object} context to add
 *        If context is an object, it must have the shape:
 *        {
 *          title: string that is used as context title in the report
 *          value: the context that is to be added
 *        }
 *
 * Usage:
 *
 * it('should test something', function () {
 *   someFunctionThatTestsCode();
 *
 *   addContext(this, 'some context to add');
 *
 *   addContext(this, {
 *     title: 'Expected number of something'
 *     value: 42
 *   });
 *
 *   assert('something');
 * });
 *
 */

const addContext = function (...args) {
  // Check args to see if we should bother continuing
  if (args.length !== 2 || !isObject(args[0])) {
    log(ERRORS.INVALID_ARGS, 'error');
    return;
  }

  const ctx = args[1];

  // Ensure that context meets the requirements
  if (!_isValidContext(ctx)) {
    log(ERRORS.INVALID_CONTEXT, 'error');
    return;
  }

  /* Context is valid, now get the test object
   * If `addContext` is called from inside a hook the test object
   * will be `.currentTest`, and the hook will be `.test`.
   * Otherwise the test is just `.test` and `.currentTest` is undefined.
   */
  const currentTest = args[0].currentTest;
  const activeTest = args[0].test;

  /* For `before` and `after`, add the context to the hook,
   * otherwise add it to the actual test.
   */
  const isEachHook =
    currentTest && /^"(?:before|after)\seach"/.test(activeTest.title);
  const test = isEachHook ? currentTest : activeTest;

  if (!test) {
    log(ERRORS.INVALID_TEST, 'error');
    return;
  }

  // Test doesn't already have context -> set it
  if (!test.context) {
    test.context = [];
  }
  test.context.push(ctx);
};

module.exports = addContext;
