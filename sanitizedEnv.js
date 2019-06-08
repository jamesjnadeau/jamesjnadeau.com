var version = require('package')(__dirname).version;
module.exports = {
  version: version,
  NODE_ENV: process.env.NODE_ENV,
};
