import { loadDirPage } from '../_load_dir';

export const iframeDocStart = '<head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=1"><meta name="author" content="James J Nadeau"><link href="/impress/built/impress_styles.css" rel="stylesheet" type="text/css">'
+ '<style>.step {width: 900px;}</style></head><body>';
// post.html
export const iframeDocEnd = '<div class="form-inline" id="impress-toolbar"></div><div class="impress-progressbar"><div></div></div><div class="impress-progress"></div>'
+ '<script src="/impress/built/impress.js" /></body>';

export async function get(req, res) {
    let html = req.params.html;
    res.end(iframeDocStart + html + iframeDocEnd);
}