const UPPERCASED_LETTERS_REGEX = new RegExp('([A-Z])', 'g');

exports.fromCamelToDash = function fromCamelToDash(string) {
  return string.replace(UPPERCASED_LETTERS_REGEX, match => {
    return '-' + match.toLowerCase();
  });
};
