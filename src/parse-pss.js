const fromCSSStringtoObject = require('./to-object');
const extend = require('./extend');

/**
 * Parse .pss source as a string and return component's name
 * and associated style.
 *
 * @param {string} source
 * @return {object} .componentName:string, .style:object
 */
function parsePSS(source) {
  // Remove any space around
  source = source.trim();

  let componentName = null;
  let lines = source.split(/\r|\n/);
  const firstLine = lines.shift();

  // Component name given
  if (!firstLine.includes(':root')) {
    // "ComponentName {" => "ComponentName"
    componentName = firstLine.replace('{', '').trim();
  }

  // Replace "::prop" or ":prop-value" with "_prop"
  let depth = 0;
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];

    if (line.includes('{')) {
      depth++;
    } else if (line.includes('}')) {
      depth--;
    }

    if (
      line.includes('::')
      && !line.includes('after')
      && !line.includes('before')
    ) {
      lines[index] = line.replace('::', '_');
    }

    if (lines[index].trim().charAt(0) === ':' && depth === 1) {
      lines[index] = lines[index].replace(':', '_');
    }
  }

  lines.pop();

  lines = lines.join('\n');
  const style = fromCSSStringtoObject(lines);

  return {
    componentName,
    style,
  };
}

module.exports = parsePSS;
