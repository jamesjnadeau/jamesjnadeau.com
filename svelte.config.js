const sveltePreprocess = require('svelte-preprocess');

const preprocess = sveltePreprocess({
	pug: true,
	// postcss: true,
});

module.exports = {
  preprocess,
  // ...other svelte options
};