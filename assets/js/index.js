require("bootstrap/dist/js/bootstrap.js");
// require("Lettering.js/jquery.lettering.js");
require('./jquery.lettering.js');
require("./jquery.smoothState.js");
require("./jquery.textillate.js");
require("./headers.js");
require("./main.js");

if (env.NODE_ENV !== 'development' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js?' + env.version);
}
