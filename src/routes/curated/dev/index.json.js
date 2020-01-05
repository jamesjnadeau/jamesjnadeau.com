import { getTag, JSONresponse } from '../_feedly';


export async function get(req, res) {
  // List the Markdown files and return their filenames
  const items = await getTag('Dev');

  await JSONresponse(items, res);
}