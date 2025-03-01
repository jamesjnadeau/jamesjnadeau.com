
import pugPlugin from "@11ty/eleventy-plugin-pug";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import * as sass from "sass";
import path from 'node:path';

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
    eleventyConfig.addGlobalData("title", "James J Nadeau | Senior Systems Engineer");
    eleventyConfig.addGlobalData("description", "");

    // configure bundles - not currently used?
    eleventyConfig.addBundle("css");
    eleventyConfig.addBundle("js");

    // Directory Passthroughs
    // Copy `static/` to `_site/subfolder/img`
	eleventyConfig.addPassthroughCopy({ static: "/" });

    // add sass config, see https://www.11ty.dev/docs/languages/custom/#example-add-sass-support-to-eleventy
    eleventyConfig.addTemplateFormats("scss");
    let node_modules_path = './node_modules'
	// Creates the extension for use
	eleventyConfig.addExtension("scss", {
		outputFileExtension: "css", // default: "html"

		// `compile` is called once per .scss file in the input directory
		compile: async function (inputContent) {

			// This is the render function, `data` is the full data cascade
			return async (data) => {
                let my_path = path.dirname(data.page.inputPath)
                let result = sass.compileString(inputContent, {
                    loadPaths: [my_path, node_modules_path],
                    quietDeps: true,
                });
				return result.css;
			};
		},
	});


    // console.log(eleventyConfig)
};

