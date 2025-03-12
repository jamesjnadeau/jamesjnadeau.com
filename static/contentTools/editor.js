
import ContentTools from 'ContentTools/build/content-tools.js';

// see https://getcontenttools.com/getting-started

function addCss(fileName) {

    var head = document.head;
    var link = document.createElement("link");
  
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = fileName;
  
    head.appendChild(link);
  }
  
  

addCss('/contentTools/content-tools.min.css');

var editor = ContentTools.EditorApp.get();
editor.init('*[data-editable]', 'data-name');

ContentTools.StylePalette.add([
    new ContentTools.Style('Text Secondary', 'text-body-secondary', ['p', 'h1', 'h2']),
    new ContentTools.Style('Lead', 'lead', ['p']),
    new ContentTools.Style('Unstyled', 'list-unstyled', ['ul', 'ol']),
    
]);

editor.addEventListener('saved', function (ev) {
    var name, payload, regions, xhr;

    // Check that something changed
    regions = ev.detail().regions;
    if (Object.keys(regions).length == 0) {
        return;
    }

    // Set the editor as busy while we save our changes
    this.busy(true);

    // Collect the contents of each region into a FormData instance
    payload = new FormData();
    for (name in regions) {
        if (regions.hasOwnProperty(name)) {
            payload.append(name, regions[name]);
        }
    }

    // Send the update content to the server to be saved
    // function onStateChange(ev) {
    //     // Check if the request is finished
    //     if (ev.target.readyState == 4) {
    //         editor.busy(false);
    //         if (ev.target.status == '200') {
    //             // Save was successful, notify the user with a flash
    //             new ContentTools.FlashUI('ok');
    //         } else {
    //             // Save failed, notify the user with a flash
    //             new ContentTools.FlashUI('no');
    //         }
    //     }
    // };
    
    // xhr = new XMLHttpRequest();
    // xhr.addEventListener('readystatechange', onStateChange);
    // xhr.open('POST', '/save-my-page');
    // xhr.send(payload);
    setTimeout(function() {
        console.log(ev.detail());
        editor.busy(false);
        new ContentTools.FlashUI('no');
    }, 2000)
});
