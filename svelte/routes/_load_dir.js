import loadPage from './_load_page';
import glob from 'glob';

async function loadDir(dir) {
  return new Promise((resolve, reject) =>
    glob(`static/_content/${dir}/*@(.md|.pug)`, (err, files) => {
      if (err) return reject(err);
      return resolve(files);
    })
  );
}

async function loadDirPage(dir, slug) {
  return new Promise((resolve, reject) =>
    glob(`static/_content/${dir}/${slug}@(.md|.pug)`, (err, files) => {
      if (err) return reject(err);
      return resolve(files);
    })
  );
}

async function jsonPageResponse(posts, req, res) {
  if (posts.length) {
		const post = posts[0];
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

		res.end(JSON.stringify(await loadPage(post, true), null, 2));
	} else {
		res.writeHead(404, {
			'Content-Type': 'application/json'
		});

		res.end(JSON.stringify({
			message: `Not found`
		}));
	}
}

async function jsonDirResponse(posts, req, res) {
  // Read the files and parse the metadata + content
  const postsFrontMatter = await Promise.all(
    posts.map(loadPage),
  );

  // Sort by reverse date, because it's a blog
  postsFrontMatter.sort((a, b) => (a.date < b.date ? 1 : -1));

  res.writeHead(200, {
    'Content-Type': 'application/json',
  });

  // Send the list of blog posts to our Svelte component
  res.end(JSON.stringify(postsFrontMatter));
}

export { loadDir, loadDirPage, jsonPageResponse, jsonDirResponse };