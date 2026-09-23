// Stands in for `fs`, `os` and `resolve` in the browser bundle. Pug reaches for them
// only to read an `include`d file or resolve a filter module, neither of
// which a post does or a browser could; using one fails with a compile
// error in the preview, which is the truth.
module.exports = {};
