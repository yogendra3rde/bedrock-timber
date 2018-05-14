const alias = require('rollup-plugin-alias');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const nodeGlobals = require('rollup-plugin-node-globals');
const replace = require('rollup-plugin-replace');
const uglify = require('rollup-plugin-uglify');

module.exports = {
    input: 'src/js/main.js',
    output: {
        file: 'dist/js/app.js',
        format: 'iife',
        sourcemap: 'inline',
    },
    plugins: [
        alias({
            // vue: require.resolve('vue/dist/vue.common'),
        }),
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        commonjs(),
        babel({ exclude: 'node_modules/**' }),
        nodeGlobals(),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
        (process.env.NODE_ENV === 'production' && uglify()),
    ],
};
