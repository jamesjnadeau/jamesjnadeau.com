import { copy } from '@web/rollup-plugin-copy';
// import { terser } from '@rollup/plugin-terser';
// import styles from 'rollup-plugin-styles';
// import browsersync from 'rollup-plugin-browsersync';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import html from '@web/rollup-plugin-html';
import path from 'path';

const prod = !process.env.ROLLUP_WATCH;

export default {
  input: '**/*.html',
  output: {
    // dir: 'rolled',
    dir: './_site',
    sourcemap: true,
    format: 'iife',
    assetFileNames: '[name][extname]',
    // assetFileNames: '[originalFileName]',
  },
  plugins: [
    copy({ 
      rootDir: '_site', 
      patterns: '**/*.{svg,jpg,png,json}' ,
      // overwrite: true,
    }),
    nodeResolve(),
    // styles({
    //   minimize: prod,
    //   mode: ['extract', 'assets/index.css'],
    // }),
    html({
      rootDir: path.join(process.cwd(), '_site'),
      // absoluteBaseUrl: 'https://jamesjnadeau.com/',
      // minify: prod,
      flattenOutput: false,
      extractAssets: false,
    }),
    commonjs({ // see https://stackoverflow.com/a/74126843
      include: /node_modules/,
      requireReturnsDefault: 'auto', // <---- this solves default issue
    }),
    // prod && terser({ output: { comments: false }, ecma: 2020, warnings: true, module: true, compress: { unsafe: true, passes: 2 } }),
    // !prod ? browsersync({ server: 'dist' }) : [],
  ],
  watch: {
    clearScreen: false,
  },
};