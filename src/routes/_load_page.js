import fm from 'front-matter';
import {fs} from 'mz';
import path from 'path';
const marked = require('marked');
const pug = require('pug');


async function loadPage(post, parseContent=false) {
  const content = (await fs.readFile(post)).toString();
  const meta = fm(content);

  let data = {
    ...meta.attributes, 
    slug: path.parse(post).name, 
    // body: meta.body,
    // filepath: post,
  };

  // should we fully parse the content?
  if (parseContent) {
    data.ext = path.extname(post);
    switch(data.ext) {
      case '.pug':
        data.html = pug.render(meta.body, {
          pretty: false,
          filename: path.resolve(post),
        })
        break;
      case '.md':
      default:
        data.html = marked(meta.body);
        break;
    }
  }

  return data;
}


export default loadPage;