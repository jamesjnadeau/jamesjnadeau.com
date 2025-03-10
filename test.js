import { rollup } from 'rollup';
import loadConfigFile from 'rollup/loadConfigFile';
// import rollupConfig from './rollup.config.js'

import path from 'node:path';
import fs from 'node:fs';
import url from 'node:url';

let default_title = 'James J Nadeau | Senior Systems Engineer'
let default_description = ''

async function rollup_build() {
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
            };
        }
    
        // You can also pass this directly to "rollup.watch"
        // rollup.watch(options);
    });
}

await rollup_build()