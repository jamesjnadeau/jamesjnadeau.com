import { loadDir, jsonDirResponse } from '../_load_dir';


export async function get(req, res) {
  // List the Markdown files and return their filenames
  const posts = await loadDir('til');

  await jsonDirResponse(posts, req, res);
}