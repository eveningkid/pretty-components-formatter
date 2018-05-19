const computeStyle = require('../compute-style');

class Stylesheet {
  constructor(name, style, extraProps={}) {
    this.identifier = name;
    this.style = style;
    this.extraProps = extraProps;
    this.computedStyle = computeStyle(name, style);
  }

  toCSS() {
    return this.computedStyle.css;
  }

  classNamesMap() {
    return this.computedStyle.classNamesMap;
  }
}

module.exports = Stylesheet;
