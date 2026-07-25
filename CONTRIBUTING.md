## What should I know before committing code

### Project specific setup/requirements to be aware of

### Reporting Bugs
> Please use the projects github Issues to report bugs.

### Testing

`npm test` builds the site and then runs, in order:

| Check | Catches |
| --- | --- |
| `test:content` | Front matter problems (bad dates, placeholder or duplicated descriptions) and built-output regressions (missing `<html lang>`, "Invalid Date", RSS/index order drift) |
| `test:html` | Invalid markup |
| `test:links` | Internal 404s |
| `test:a11y` | axe-core WCAG 2 A/AA violations |

`npm run test:lighthouse` runs separately — it's slower and its performance
numbers vary with machine load, so it isn't part of `npm test`.

CI runs all of the above and will not deploy unless they pass.

Two checks carry a documented backlog rather than failing outright:

- `.htmlvalidate.decks.json` downgrades several rules for `content/presentations/`.
  The impress.js decks have markup issues (emoji-derived heading ids, lists nested
  under headings) that predate this suite. Promote rules back to `error` as decks
  get cleaned up; don't add new entries.
- `test/a11y/axe.test.js` waives `meta-viewport` for decks, because impress.js
  rewrites the viewport at runtime. Lighthouse waives deck `color-contrast` for
  the same structural reason: inactive steps sit at `opacity: .05` by design.

## Styleguides

### Git Commit Messages
* Add/Allow pre-commit hooks that run `npm run build` to ensure your commits clean and ready before getting into the repo
* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally
* Consider starting the commit message with an applicable emoji:
    * 🎉 :tada: `:tada:` Initial commit
    * ✨ :sparkles: `:sparkles:` New feature
    * ⚡ :zap: `:zap:` General Update
    * 🐛 :bug: `:bug:` When fixing a bug
    * 🔥 :fire: `:fire:` When removing code or files
    * 👮 :cop: `:cop:` When cleaning up committed code that doesn't pass styleguides
    * 🎨 :art: `:art:` When improving the format/structure of the code
    * 🏇 :racehorse: `:racehorse:` When improving performance
    * 🚱 :non-potable_water: `:non-potable_water:` When plugging memory leaks
    * 📝 :memo: `:memo:` When writing docs
    * 🐧 :penguin: `:penguin:` When fixing something on Linux
    * 🍎 :apple: `:apple:` When fixing something on Mac OS
    * 🏁 :checkered_flag: `:checkered_flag:` When fixing something on Windows
    * 💚 :green_heart: `:green_heart:` When fixing the CI build
    * :whale: `:whale:` When making changes to docker
    * :white_check_mark: `:white_check_mark:` When adding tests
    * :dart: `:dart:` When a previously added test is now passing.
    * 🚨:rotating_light: `:rotating_light:` When altering tests
    * 🔒 :lock: `:lock:` When dealing with security
    * 🛄 :baggage_claim: `:baggage_claim:` When adding a dependency
    * ⬆️ :arrow_up: `:arrow_up:` When upgrading dependencies
    * ⬇️ :arrow_down: `:arrow_down:` When downgrading dependencies
    * 👕 :shirt: `:shirt:` When removing linter warnings
    * 📈 :chart_with_upwards_trend: `:chart_with_upwards_trend:` Doing config changes for dev/production when pushing things live.
    * :squirrel: `:squirrel:` Ship It - when moving code from development to staging/production
    * Others... be creative! :chart_with_upwards_trend: :bicyclist: :house_with_garden:
