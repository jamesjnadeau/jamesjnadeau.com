// The corner of Node's `path` that Pug's compiler touches while it names the
// file it is compiling (see empty.cjs for why there is no file behind it).
exports.dirname = function dirname(p) {
  const i = p.lastIndexOf('/');
  return i > 0 ? p.slice(0, i) : i === 0 ? '/' : '.';
}

exports.extname = function extname(p) {
  const base = p.slice(p.lastIndexOf('/') + 1);
  const i = base.lastIndexOf('.');
  return i > 0 ? base.slice(i) : '';
}

exports.join = function join(...parts) {
  return parts.filter(Boolean).join('/').replace(/\/+/g, '/');
}

