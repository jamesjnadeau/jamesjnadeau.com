---
name: writing-impress-presentations
description: Use when turning a talk, outline, notes, or existing slide deck (PowerPoint, Google Slides, Markdown) into a presentation for jamesjnadeau.com, or when adding or editing a file in content/presentations/. Covers impress.js decks written in Pug for the Eleventy site.
---

# Writing impress.js presentations for jamesjnadeau.com

## Overview

Each deck is **one Pug file** in `content/presentations/`, rendered by Eleventy
through `content/_includes/layouts/presentation.pug` (set for the whole folder
by `presentations.11tydata.json`). The file holds front matter plus a single
`#impress` element whose `.step` children are the slides. impress.js places
each step on a 3D canvas and flies the camera between them.

`<slug>.pug` publishes at `/presentations/<slug>/`.

## The file

```pug
---
title: James J Nadeau | Ed-Fi Year 3
description: "Ed-Fi at VT Fest: third-year progress and what comes next."
---

- var xspace = 1500;
- var yspace = 1500;
- var zspace = 500;

#impress
  .step
    h1 Welcome 👋
    p I hope to cover:
    ul
      li ❓ Where we are
      li 📈 Where we're going
    .notes Thank the organisers; ask who has used Ed-Fi.

  .step(data-rel-x=xspace data-rel-z=zspace)
    h1 💻 Who am I?
    p.substep 🚶 Vermonter
    p.substep ⚙️ Systems engineer

  .step(data-rotate=90 data-rel-x=xspace data-rel-y=0 data-rel-z=0)
    h2 🤔 How it fits together
    img(src="/files/ed-fi-year-3/architecture.png" alt="Ed-Fi data flow from SIS to state")

  .step(data-rel-z=16*zspace data-rel-x=-3*xspace data-rel-y=-4*yspace data-rotate-x=20)
    h1 The End 🌈
    p Any questions?
```

### Front matter (enforced by `npm test`)

| Key | Rule |
|---|---|
| `title` | Required. Convention: `James J Nadeau \| <Deck name>`. |
| `description` | Required in practice and **unique across the whole site** — never copy another deck's. Quote it if it contains `: `. |
| `layout` | Omit. The folder data file supplies `layouts/presentation.pug`. |
| keys | Lower case only. Any `date:` must be ISO 8601 (`2026-10-17`). |

### Body

- Indent with spaces, consistently (existing decks use 2 or 4).
- Put `- var` spacing constants at the top of the file. **The layout's
  `space`/`stepWidth` variables are not visible to the deck** — declare
  everything you use. An undeclared variable renders `data-x="null"` and the step lands at 0.
- One root: `#impress`. Do not add `#impress-toolbar`, progress bars, or the
  `impress().init()` script; the layout already does.
- Steps are 900px wide (`stepWidth` in the layout) at a 2rem base font, so a
  step holds a heading plus roughly 5–7 short bullets. Split anything longer.
- Bootstrap 5 classes work inside steps (`.row`, `.col-6`, `.lead`,
  `.text-center`, `.img-fluid`, `.text-success`).

## Quick reference

**Positioning** (`data-*` attributes on `.step`; numbers in px/degrees)

| Attribute | Meaning |
|---|---|
| `data-x`, `data-y`, `data-z` | Absolute centre of the step. An unset axis keeps the previous step's position. Setting one cancels any inherited `data-rel-*` on that axis. |
| `data-rel-x`, `data-rel-y`, `data-rel-z` | Offset from the previous step, always along the canvas axes (not the previous step's rotation). **Unset values repeat the previous step's offset**, so after a `data-rel-z` step, set `data-rel-z=0` to stop moving in z. Accepts `1.5w` / `1.5h` (multiples of screen width/height). Preferred: reordering slides doesn't break the layout. |
| `data-rel-to="step-id"` | Measure the offset from an earlier step instead of the previous one. |
| `data-rotate` (=`data-rotate-z`), `data-rotate-x`, `data-rotate-y` | Rotation in degrees. **Not inherited**: each step is 0 unless set. |
| `data-scale` | Size multiplier, 1 unless set (not inherited). |
| `data-autoplay="10"` | Auto-advance after N seconds. |

Pug evaluates attribute expressions, so `data-rel-x=-.5*xspace` is fine.

**Content helpers**

| Markup | Effect |
|---|---|
| `.substep` on any child | Revealed one at a time on each "next" press. |
| `.notes` child | Speaker notes; hidden on the slide, shown in the presenter console (press `P`). For several lines, use `.notes.` and indent the text under it. |
| `#some-id.step` | Readable URL `#/some-id` instead of `#/step-N`. |
| `.step.display-always` | Step stays fully visible when inactive (timelines, maps). |
| `.step.display-past` / `.step.hidden-past` | Keep visited steps visible / hide them after leaving. |
| `#impress.disable-animation` | Turn off the fade-in/out transitions. |
| `pre: code.language-xyz.` + indented lines | Code block; the trailing `.` makes the indented lines literal text. Decks have **no syntax highlighter** (CDN Prism is banned), so it renders as plain monospace. Count it as 2–3 bullets of space. |

**Layout ideas used in existing decks**

- Forward through space: `data-rel-z=space data-rel-y=space` on every step
  (`static-site-netlify.pug`).
- Timeline: loop a running `x += space` with alternating `data-y` above and
  below the axis (`timeline.pug`).
- A closing overview: a final empty `#overview.step` with absolute
  `data-x`/`data-y`/`data-z` at roughly the centre of all the steps and a
  `data-scale` big enough to frame them: about the canvas span divided by
  1000 (e.g. `5` for steps spread over ~5000px). Work the centre out from
  your spacing variables; inheritance makes guessing unreliable.

## Converting an existing deck

1. One source slide → one `.step`, ideally with a readable id
   (`#hardware.step`). Title → `h1` (or `h2` for sub-topics). A leading emoji
   on headings and bullets is the house style in the recent decks
   (`aoe-edfi-year-2.pug`); keep it unless the talk is formal.
2. Bullets → `ul`/`li`. Build animations → `.substep`.
3. Presenter notes → a `.notes` child.
4. Images → copy into `static/files/<slug>/` and reference as
   `/files/<slug>/<name>.png`, always with `alt`. `static/` is published
   whole, so check nothing private is in what you copy.
5. Move steady within a section (same `data-rel-*` each step), and change
   direction, depth or rotation at the first step of a new section, so motion
   marks a topic change. Later steps in that section keep the new direction;
   reset only when the next section starts.

## Publishing checklist

1. Add a link at the end of the right `list-group` in
   `content/presentations/index.pug` (no trailing slash, like the others):
   `a.list-group-item(href='/presentations/<slug>' target="_blank") <Name>`
2. `npm run build` then `npm test`. Decks get relaxed HTML/a11y rules
   (`.htmlvalidate.decks.json`), but they must still build, have a title and
   a unique description, and load no `<script src="https://...">`.
3. Open `/presentations/<slug>/` with `npm run dev` and step through it with
   the arrow keys.

## Common mistakes

| Mistake | Fix |
|---|---|
| Using `space` without declaring it | Add `- var space = 1000;` at the top. |
| Steps keep drifting in z (or x/y) | An earlier `data-rel-*` is still being inherited; set it to `0`. |
| Rotation "snaps back" | Rotation isn't inherited; repeat `data-rotate=90` on each step that should stay turned. |
| Copying another deck's `description` | Write a new one; `test:content` fails on duplicates. |
| `Title:` or `Description:` | Lower-case keys; capitalised ones are silently ignored. |
| CDN `<script>`/Prism tags | Not allowed; vendor through `.eleventy.js` if truly needed. |
| Hot-linked images | Copy into `static/files/<slug>/` so the deck survives link rot. |
| Writing a Markdown deck | Decks are Pug; a `.md` here would render as a page, not slides. |
| Forgetting `index.pug` | The deck builds but nobody can find it. |
