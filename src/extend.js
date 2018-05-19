const deepmerge = require('deepmerge');
const fromCSSStringtoObject = require('./to-object');

/**
 * Copy all styles from `origins` into `extender`.
 *
 * @param {array[Stylesheet]} origins all the ones before the last one
 * @param {object} extender last one
 */
function extend() {
  let origins = Array.from(arguments);
  let extender = origins.pop();
  if (typeof extender === 'string') {
    extender = fromCSSStringtoObject(extender);
  }
  origins = origins.map(origin => origin.style);
  return deepmerge.all(origins.concat(extender));
}

module.exports = extend;
