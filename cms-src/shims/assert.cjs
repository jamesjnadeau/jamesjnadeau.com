// Node's `assert`, as far as Pug's lexer and parser call it: as a function.
module.exports = function assert(value, message) {
  if (!value) throw new Error(message ?? 'Assertion failed');
};
