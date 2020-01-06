// var RSS = require('rss');
// import { loadDir } from '../_load_dir';

// var feedOptions = {
//   title: 'James\' Today I ... ',
//   description: 'A collection of things I found interesting at the time.',
//   site_url: 'https://jamesjnadeau.com',
// };

// export async function get(req, res) {
//   const posts = await loadDir('TIL');

//   // Create rss feed
//   var feed = new RSS(feedOptions);
//   posts.forEach(function(post) {
//     var url = 'TIL/' + post.slug;
//     var urlParts = post.slug.split('-');
//     var date = urlParts.slice(0, 3).join('-');
//     var name = urlParts.slice(3).join(' ');
//     // upper case first letter
//     // name = name.charAt(0).toUpperCase() + name.slice(1);
//     name = post.title;
//     feed.item({
//       date: new Date(date),
//       title: name,
//       url: 'https://jamesjnadeau.com/' + url + '/index.html',
//     });
//   });
//   var feedXML = feed.xml({ indent: true });
//   res.send(feedXML);
// }