import loadPage from 'src/routes/_load_page';
import path from 'path';

export const iframeDocStart = '<head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=1"><meta name="author" content="James J Nadeau"><link href="/impress/built/impress_styles.css" rel="stylesheet" type="text/css">'
+ '<style>.step {width: 900px;}</style>'
+ '<base href="/">'
+ '</head>' 
+ '<body>';
// post.html
export const iframeDocEnd = `<div class="form-inline" id="impress-toolbar"></div>
<div class="impress-progressbar">
    <div></div>
</div>
<div class="impress-progress"></div>`
+ '<script src="/impress/impress.js"></script>'
// + '<script src="/impress/built/impress.js">'
+ `<script>window.impress().init();
var buttons = document.querySelectorAll('#impress-toolbar button');
[].forEach.call(buttons, function(el) {
    el.classList.add('btn');
    el.classList.add('btn-outline-dark');
    el.classList.add('mx-1');
});

var select = document.querySelectorAll('#impress-toolbar select');
[].forEach.call(select, function(el) {
    el.classList.add('form-control');
    el.classList.add('mx-1');
});
console.log('here');
</script>`
+ '</body>';

export async function get(req, res) {
    const { slug } = req.params;
    const filePath = path.normalize('static/_content/presentations/' + slug + '.pug');
    const post = await loadPage(filePath, true);

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    res.end(iframeDocStart + post.html + iframeDocEnd);
}