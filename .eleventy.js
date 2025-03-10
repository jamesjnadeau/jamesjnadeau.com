
import pugPlugin from "@11ty/eleventy-plugin-pug";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import * as sass from "sass";
import purgeCssPlugin from "eleventy-plugin-purgecss";
import eleventySass from "eleventy-sass";

import { rollup } from 'rollup';
import loadConfigFile from 'rollup/loadConfigFile';
// import rollupConfig from './rollup.config.js'

import path from 'node:path';
import fs from 'node:fs';
import url from 'node:url';

let default_title = 'James J Nadeau | Senior Systems Engineer'
let default_description = ''

async function rollup_build() {
	// let bundle;
	// let buildFailed = false;
	// try {
	// 	// Create a bundle. If you are using TypeScript or a runtime that
	// 	// supports it, you can write
	// 	//
	// 	await using bundle = await rollup(inputOptions);

    //     // write bundle to output
	// 	await bundle.generate(outputOptions);
	// } catch (error) {
	// 	buildFailed = true;
	// 	// do some error reporting
	// 	console.error(error);
	// }
	// if (bundle) {
	// 	// closes the bundle
	// 	await bundle.close();
	// }
	// process.exit(buildFailed ? 1 : 0);

    await loadConfigFile(path.resolve(import.meta.dirname, 'rollup.config.js'), {
        format: 'es'
    }).then(async ({ options, warnings }) => {
        console.log('ROLLUP CONFIG LOADED');
        // "warnings" wraps the default `onwarn` handler passed by the CLI.
        // This prints all warnings up to this point:
        console.log(`We currently have ${warnings.count} warnings`);
    
        // This prints all deferred warnings
        warnings.flush();
    
        // options is an array of "inputOptions" objects with an additional
        // "output" property that contains an array of "outputOptions".
        // The following will generate all outputs for all inputs, and write
        // them to disk the same way the CLI does it:
        for (const optionsObj of options) {
            const bundle = await rollup(optionsObj);
            await Promise.all(optionsObj.output.map(bundle.write)).then(async () => {
                console.log('ROLLUP BUNDLE GENERATED');
            });
        }
    
        // You can also pass this directly to "rollup.watch"
        // rollup.watch(options);
    });
}

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
    // if (process.env.NODE_ENV === "production") {
    //     eleventyConfig.addPlugin(purgeCssPlugin, {
    //         // Optional: Specify the location of your PurgeCSS config
    //         config:  {
    //             // Content files referencing CSS classes
    //             content: ["./_site/**/*.html", "./_site/**/*.js"],
            
    //             // CSS files to be purged in-place
    //             css: ["./_site/**/*.css"],
    //         },

    //         // Optional: Set quiet: true to suppress terminal output
    //         quiet: false,
    //     });
    // }

    // rollup
    eleventyConfig.on(
		"eleventy.after",
		async ({ dir, results, runMode, outputMode }) => {
			// Run me after the build ends
            await rollup_build();
            console.log('ROLLUP COMPLETE -- ROLL OUT');
		}
	);

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

    // console.log(eleventyConfig)
};

