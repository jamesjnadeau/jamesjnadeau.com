require("bootstrap/dist/js/bootstrap.js");
require("Lettering.js/jquery.lettering.js");
require("./jquery.smoothState.js");
require("./jquery.textillate.js");
require("./headers.js");
require("./main.js");

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
