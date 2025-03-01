import { loadDirPage, jsonPageResponse } from '../_load_dir';

export async function get(req, res) {
	// the `slug` parameter is available because
	// this file is called [slug].json.js
	const { slug } = req.params;

	// List the Markdown files and return their filenames
  const posts = await loadDirPage('til', slug);

	await jsonPageResponse(posts, req, res);
}
