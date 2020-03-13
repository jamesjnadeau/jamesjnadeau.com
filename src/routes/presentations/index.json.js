  
import glob from 'glob';
import loadPage from 'src/routes/_load_page';

export async function get(req, res) {
  // List the Markdown files and return their filenames
  const posts = await new Promise((resolve, reject) =>
      glob('static/_content/presentations/index@(.md|.pug)', (err, files) => {
      if (err) return reject(err);
      return resolve(files);
    }),
  );

  res.writeHead(200, {
    'Content-Type': 'application/json',
  });

  // Send the list of blog posts to our Svelte component
  res.end(JSON.stringify(await loadPage(posts[0], true)));
}