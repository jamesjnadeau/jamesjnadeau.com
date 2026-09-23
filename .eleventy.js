
import pugPlugin from "@11ty/eleventy-plugin-pug";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import * as sass from "sass";
import purgeCssPlugin from "eleventy-plugin-purgecss";
import eleventySass from "eleventy-sass";

import path from 'node:path';
import fs from 'node:fs';
import url from 'node:url';

let default_title = 'James J Nadeau | Senior Systems Engineer'
let default_description = 'Personal site of James J Nadeau, Senior Systems Engineer — projects, notes, and presentations.'

export default async function(eleventyConfig) {

    // add navigation plugin
    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    // set input/ouput directories
    eleventyConfig.setInputDirectory("content");
    eleventyConfig.setOutputDirectory("_site");

    // use pug plugin, 
    global.eleventyNavigationPlugin = eleventyNavigationPlugin.navigation; // see https://github.com/11ty/eleventy-plugin-template-languages/issues/1#issuecomment-2221156643
    
    eleventyConfig.addPlugin(pugPlugin, {
		debug: true,
        // filters: eleventyConfig.filters,
        globals: ['eleventyNavigationPlugin']
        // {
        //     'eleventyNavigation': function (text) {
        //         return text
        //     },
        // }
	});

    // set global layout
    eleventyConfig.addGlobalData("layout", "layouts/main.pug");

    // defaul title/descriptions
    eleventyConfig.addGlobalData("title", default_title);
    eleventyConfig.addGlobalData("description", default_description);

    // configure bundles - not currently used?
    eleventyConfig.addBundle("css");
    eleventyConfig.addBundle("js");

    // Directory Passthroughs
    // Copy `static/` to `_site/subfolder/img`
	eleventyConfig.addPassthroughCopy({ static: "/" });

    // Vendor front-end JS from node_modules instead of a CDN, so the built site
    // is self-contained and reproducible (and Bootstrap's JS matches its Sass).
    eleventyConfig.addPassthroughCopy({
        "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js": "js/bootstrap.bundle.min.js",
        "node_modules/headroom.js/dist/headroom.min.js": "js/headroom.min.js",
        "node_modules/@barba/core/dist/barba.umd.js": "js/barba.umd.js",
        // Only an author's browser loads it (see the loader in layouts/main.pug).
        "node_modules/netlify-identity-widget/build/netlify-identity-widget.js": "js/netlify-identity-widget.js",
    });

    // The ContentTools editor, from its published package (GitHub Packages;
    // see .npmrc). edit.js, shell.js and the chunks both import must sit in one
    // folder: the chunk names are content-hashed, and edit.js links the content
    // stylesheet and images/ relative to its own URL. `npm run build` empties
    // _site/ first, so a chunk from an older version can't outlive an upgrade.
    // The site's own glue (static/cms/boot.js, netlify.js) lands beside it
    // through the `static` passthrough above; a test keeps the names apart.
    const contentTools = "node_modules/@jamesjnadeau/content-tools/dist";
    eleventyConfig.addPassthroughCopy({
        [`${contentTools}/edit.js`]: "cms/edit.js",
        [`${contentTools}/shell.js`]: "cms/shell.js",
        [`${contentTools}/chunks`]: "cms/chunks",
        [`${contentTools}/images`]: "cms/images",
        [`${contentTools}/content-tools-content.min.css`]: "cms/content-tools-content.min.css",
    });

    // add sass config, see https://www.11ty.dev/docs/languages/custom/#example-add-sass-support-to-eleventy
    eleventyConfig.addTemplateFormats("scss");
    let node_modules_path = './node_modules'

    eleventyConfig.addPlugin(eleventySass, {
        sass: {
            loadPaths: [node_modules_path],
            quietDeps: true,
            style: "compressed",
            sourceMap: true,
          },
    });

    // Legacy method perscribed in eleventy docs, above works better and has source maps
	// Creates the extension for use
	// eleventyConfig.addExtension("scss", {
	// 	outputFileExtension: "css", // default: "html"

	// 	// `compile` is called once per .scss file in the input directory
	// 	compile: async function (inputContent) {
	// 		// This is the render function, `data` is the full data cascade
    //         const compiler = await sass.initAsyncCompiler();
	// 		return async (data) => {
    //             // console.log()
    //             let my_path = path.dirname(data.page.inputPath)
    //             // let result = sass.compileString(inputContent, {
    //             let result = await compiler.compileAsync(data.page.inputPath, {
    //                 loadPaths: [my_path, node_modules_path],
    //                 quietDeps: true,
    //                 sourceMap: true,
    //                 style: 'compressed',
    //             });
    //             let inputURL = url.pathToFileURL(path.resolve(data.page.inputPath)).href;

    //             // await new Promise(function(resolve, reject) {
    //             //     fs.writeFile(`${data.page.outputPath}.map`, result.sourceMap.sourcesContent, resolve);
    //             // });
                
    //             return result.css;
                
	// 		};
	// 	},
	// });

    // purge-css
    if (process.env.NODE_ENV === "production") {
        eleventyConfig.addPlugin(purgeCssPlugin, {
            // Optional: Specify the location of your PurgeCSS config
            config:  {
                // Content files referencing CSS classes
                content: ["./_site/**/*.html", "./_site/**/*.js"],
            
                // CSS files to be purged in-place
                css: ["./_site/**/*.css"],

                // The ContentTools editor, left exactly as its package ships
                // it. Its stylesheet is for markup no published page contains
                // until an author starts editing, so purging it would strip
                // every rule silently; and its JS names hundreds of classes the
                // site's own CSS has no business keeping. PurgeCSS applies this
                // to both `css` and `content`. The Identity widget is skipped
                // for the second reason: it draws in its own iframe, and the
                // words in its source would otherwise keep ~500 bytes of
                // Bootstrap nobody uses.
                skippedContentGlobs: ["_site/cms/**", "_site/js/netlify-identity-widget.js"],
},

            // Optional: Set quiet: true to suppress terminal output
            quiet: false,
        });
    }

    // rss feed
    eleventyConfig.addPlugin(feedPlugin, {
		type: "rss", // or "atom", "json"
		outputPath: "/til/rss.xml",
		collection: {
			name: "TIL", // iterate over `collections.posts`
			limit: 10,     // 0 means no limit
		},
		metadata: {
			language: "en",
			title: "Today I ... by James Nadeau",
			subtitle: "A collection of things I found interesting at the time..",
			base: "https://jamesjnadeau.com/",
			author: {
				name: "James Nadeau",
				email: "", // Optional
			}
		}
	});

    // Code blocks scroll horizontally, which makes them a scrollable region.
    // Those need to be keyboard-focusable or the content is unreachable without
    // a mouse (axe: scrollable-region-focusable).
    eleventyConfig.addTransform("focusableCodeBlocks", function (content) {
        if (!this.page.outputPath?.endsWith(".html")) return content;
        return content.replace(/<pre(?![^>]*\btabindex=)/g, '<pre tabindex="0"');
    });
};

