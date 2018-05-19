const { fromCamelToDash } = require('./utils');

function generateCSS(selector, node) {
  let allSelectors = [];
  let generatedCSS = '';
  let important = '';

  if (selector.includes('--') || selector.charAt(0) === ':') {
    // .a__m--b or .a--b or .*:*
    important = '!important';
  }

  node = Object.entries(node);
  for (let [property, value] of node) {
    if (typeof value === 'object') {
      // e.g: p: { color: 'red', ... }
      const localSelector = property.split(',').map(currentProperty => {
        currentProperty = currentProperty.trim();
        if (currentProperty.includes('&')) {
          // &:hover, & + ...
          currentProperty = currentProperty.replace('&', selector);
        } else {
          // <*element>
          currentProperty = selector + ' ' + currentProperty;
        }
        return currentProperty;
      }).join(',');
      const deepNodeCSS = generateCSS(localSelector, value);
      allSelectors = allSelectors.concat(deepNodeCSS);
    } else {
      // 64 -> '64px'
      if (typeof value === 'number') {
        value += 'px';
      }

      property = fromCamelToDash(property);
      generatedCSS += `${property}:${value}${important};`;
    }
  }

  if (generatedCSS.length > 0) {
    allSelectors.push(`${selector}{${generatedCSS}}`);
  }

  return allSelectors;
}

function toCSS(selector, css) {
  return generateCSS(selector, css)
    .join('')
    .replace(new RegExp(selector, 'g'), '.' + selector);
}

module.exports = toCSS;
