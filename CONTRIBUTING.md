## What should I know before committing code

### Project specific setup/requirements to be aware of

### Reporting Bugs
> Please use the projects github Issues to report bugs.

### Testing
> See `npm run test` for how tests are started. This command must return without error
> for Continuous Integration(CI) to pass your work as acceptable. This command is run as part of
> `npm run build`.

## Styleguides

### Git Commit Messagesu
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
## Tests/Specs

There is some selenium/webdriver.io based specs that were started, but I could not get them to run on the jenkins build instance consistantly.
