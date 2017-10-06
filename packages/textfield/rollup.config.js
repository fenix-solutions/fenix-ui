import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
    entry: '../../packages/textfield/es5/textfield.es5.js',
    dest: '../../packages/textfield/bundles/textfield.umd.js',
    format: 'umd',
    moduleName: 'fenix.textfield',
    plugins: [
        resolve(),
        sourcemaps()
    ],
    globals: {
        '@angular/core': "ng.core"
    }
}