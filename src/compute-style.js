const { fromCamelToDash } = require('./utils');
const toCSS = require('./to-css');

const PROP_MARKER = '_';

// const styleTest = { _prop: { big: { '&:hover': { color: 'blue' } } } };
function computeStyle(name, style) {
  /*
  color: 'red',
  _size: {
    big: {
      fontSize: 15,
      '&:hover': {
        color: 'blue',
      },
    },
  },
  =>
  {
    __root: {
      color: 'red',
    },
    'size:big': {
      fontSize: 15,
      '&:hover': {
        color: 'blue',
      }
    },
  }
  */

  const styleProperties = Object.entries(style);
  const orderedStyles = {};

  const rootProperties = {};
  const propBasedProperties = [];
  for (const [propertyName, propertyValue] of styleProperties) {
    // Deep prop, not native css
    if (propertyName.charAt(0) === PROP_MARKER) {
      propBasedProperties.push(propertyName);
    } else {
      rootProperties[propertyName] = propertyValue;
    }
  }

  // propBasedProperties = ['_size', '_blueText']
  const finalProperties = [];
  for (const propBasedProperty of propBasedProperties) {
    const propertyStyles = Object.entries(style[propBasedProperty]);
    const currentProperties = {};

    // [['big', { color: 'red' }], ]
    // [['color', 'blue'] ]
    for (const [propertyName, propertyValue] of propertyStyles) {
      if (propertyName.charAt(0) === PROP_MARKER) {
        finalProperties.push([propBasedProperty, propertyName]);
      } else {
        currentProperties[propertyName] = propertyValue;
      }
    }

    if (Object.keys(currentProperties).length > 0) {
      const currentKey = fromCamelToDash(propBasedProperty.substr(1)); // _size => size
      orderedStyles[currentKey] = currentProperties;
    }
  }

  // finalProperties = [['_size', 'big'], ['_size', '2'], ...]
  for (const [parentFinalProperty, finalProperty] of finalProperties) {
    const key = fromCamelToDash(parentFinalProperty.substr(1))
      + ':'
      + fromCamelToDash(finalProperty.substr(1));
    orderedStyles[key] = style[parentFinalProperty][finalProperty];
  }

  orderedStyles.__root = rootProperties;

  const componentName = name;
  const classNamesMap = {};
  const css = [];

  for (const [key, cssForKey] of Object.entries(orderedStyles)) {
    let keyClassName;

    if (key === '__root') {
      keyClassName = componentName;
    } else {
      const [propName, propValue] = key.split(':');
      if (propValue) {
        // prop:value
        keyClassName = componentName + '__' + propName + '--' + propValue;
      } else {
        // prop
        keyClassName = componentName + '--' + propName;
      }
    }

    classNamesMap[key] = keyClassName;
    const generatedCSS = toCSS(keyClassName, cssForKey);
    css.push(generatedCSS);
  }

  return {
    css: css.join(''),
    classNamesMap,
  };
}

module.exports = computeStyle;
