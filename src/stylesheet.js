const uniqid = require('uniqid');
const fromCSSStringtoObject = require('./to-object');
const Stylesheet = require('./model/stylesheet');

function stylesheet(identifier, style) {
  let hasName = false;

  // stylesheet('...', ...) or stylesheet(Component, ...)
  if (identifier.name) {
    identifier = identifier.name;
    hasName = true;
  }

  if (identifier.displayName) {
    identifier = identifier.displayName;
    hasName = true;
  }

  if (style && typeof identifier === 'string') {
    hasName = true;
  }

  if (!hasName) {
    if (typeof identifier === 'object') {
      // stylesheet({ ... })
      // No 'name' given
      style = identifier;
      identifier = uniqid();
    } else if (typeof identifier === 'string') {
      // stylesheet(`...`)
      style = fromCSSStringtoObject(identifier);
      identifier = uniqid();
    }
  }

  // stylesheet('...', `...`)
  if (hasName && typeof style === 'string') {
    style = fromCSSStringtoObject(style);
  }

  return new Stylesheet(identifier, style);
}

module.exports = stylesheet;
