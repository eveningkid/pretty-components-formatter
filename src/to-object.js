const camelCase = require('camelcase-css');

/**
 * From a CSS/SCSS string to a style object usable later.
 *
 * @param {string} string
 * @return {object}
 */
function fromCSSStringtoObject(string) {
  const styleObject = {};
  const lines = string.split(/\r|\n/);

  let currentIdentifier = '';
  const currentIdentifierPath = [];

  for (let line of lines) {
    line = line.trim();

    if (line.length === 0) {
      continue;
    }

    const lineLastCharacter = line.substr(-1);
    switch (lineLastCharacter) {
      case '{':
        const curlyBracketIndex = line.indexOf('{');
        currentIdentifier = line.substr(0, curlyBracketIndex).trim();
        currentIdentifierPath.push(currentIdentifier);
        break;

      case '}':
        currentIdentifierPath.pop();
        break;

      default:
        let [key, value] = line.split(':');
        let node = styleObject;
        for (const pathElement of currentIdentifierPath) {
          if (!(pathElement in node)) {
            node[pathElement] = {};
          }
          node = node[pathElement];
        }
        key = camelCase(key.trim());
        value = value.trim();
        value = value.substr(0, value.lastIndexOf(';'));
        node[key] = value;
    }
  }

  return styleObject;
}

module.exports = fromCSSStringtoObject;
