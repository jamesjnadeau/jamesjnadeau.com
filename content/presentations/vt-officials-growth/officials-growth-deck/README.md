# officials-growth deck

Copy into the jamesjnadeau.com repo at the same paths:

- content/presentations/vt-officials-growth/officials-growth.pug
- static/files/officials-growth/*.svg

Then add this line at the end of the right list-group in
content/presentations/index.pug:

    a.list-group-item(href='/presentations/vt-officials-growth/officials-growth' target="_blank") Growing Our Officials

and run `npm run build && npm test`.

Data: aggregate counts only (no names or emails), from the Arbiter warehouse
on media, snapshot 2026-10-16T23-38-34Z.
