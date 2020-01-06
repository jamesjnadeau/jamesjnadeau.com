var RSS = require('rss');
import { loadDir } from '../_load_dir';
import loadPage from '../_load_page';

var feedOptions = {
  title: 'James\' Today I ... ',
  description: 'A collection of things I found interesting at the time.',
  site_url: 'https://jamesjnadeau.com',
};

export async function get(req, res) {
  // load posts
  const posts = await loadDir('TIL');

  const postsFrontMatter = await Promise.all(
    posts.map(loadPage),
  );

  // Sort by reverse date, because it's a blog
  postsFrontMatter.sort((a, b) => (a.date < b.date ? 1 : -1));

  // Create rss feed
  var feed = new RSS(feedOptions);
  postsFrontMatter.forEach(function(post) {
    var url = 'TIL/' + post.slug;
    if (post.date) {
      feed.item({
        date: new Date(post.date),
        title: post.title,
        url: 'https://jamesjnadeau.com/' + url + '/index.html',
      });
    }
  });

  res.writeHead(200, {
    'Content-Type': 'application/xml'
  });

  res.end(feed.xml({ indent: true }));
}