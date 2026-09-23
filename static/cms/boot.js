// Starts ContentTools' in-page editor (edit.js) on a markdown page of the site.
//
// Not on every page: the loader at the bottom of
// content/_includes/layouts/main.pug imports this only on a page that is an
// entry, and only when there is an author to serve: a Netlify Identity session
// in this browser, a token handed over from /admin/, or `?cms-edit` on the
// URL. A reader downloads none of it.
//
// edit.js decides for itself whether to put its bar up, by asking whether this
// tab holds a ContentTools token, and talks to api.github.com. Before it
// loads, this files the author's Identity JWT where it looks (or takes back
// one left from a session that has since ended) and routes its GitHub calls
// through Netlify's Git Gateway (see netlify.js).

import { fileSessionToken, gatewayFetch } from './netlify.js';

// edit.js builds its GitHub client with the global `fetch`, so the gateway
// has to be installed there. It only reroutes calls for this site's own
// repository; every other request goes out exactly as it would have.
window.fetch = gatewayFetch();

await fileSessionToken();

await import('./edit.js');
