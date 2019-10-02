const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    // Project deployment base
    publicPath: '/',

    // where to output built files
    // 打包后的输出目录
    outputDir: 'dist',

    // whether to use eslint-loader for lint on save.
    lintOnSave: false,

    // tweak internal webpack configuration.
    configureWebpack: config => {
        config.resolve = {
            extensions: ['.js', '.vue', '.json', ".css"],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': resolve('src'),
            }
        }
    },

    // generate sourceMap for production build?
    productionSourceMap: true,

    // entry template
    pages: {
        index: {
            // entry for the page
            entry: 'src/main.js',
            // the source template
            template: 'src/template/index.ejs',
            // output as dist/index.html
            filename: 'index.html',
            // when using title option,
            // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'ZPan',
            // chunks to include on this page, by default includes
            // extracted common chunks and vendor chunks.
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        404: {
            entry: 'src/main.js',
            template: 'src/template/index.ejs',
            filename: '404.html',
            title: 'ZPan',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        // when using the entry-only string format,
        // template is inferred to be `public/subpage.html`
        // and falls back to `public/index.html` if not found.
        // Output filename is inferred to be `subpage.html`.
        // subpage: 'src/subpage/main.js'
        login: {
            entry: 'src/login.js',
            template: 'src/template/index.ejs',
            filename: 'login.html',
            title: 'GWProtal - Login',
            chunks: ['chunk-vendors', 'chunk-common', 'login']
        }
    },

    // CSS related options
    css: {
        // extract CSS in components into a single CSS file (only in production)
        extract: true,

        // enable CSS source maps?
        sourceMap: false,

        // pass custom options to pre-processor loaders. e.g. to pass options to
        // sass-loader, use { sass: { ... } }
        loaderOptions: {},

        // Enable CSS modules for all css / pre-processor files.
        // This option does not affect *.vue files.
        modules: false
    },

    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require('os').cpus().length > 1,

    // options for the PWA plugin.
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},

    // configure webpack-dev-server behavior
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                ws: true,
                changeOrigin: true
            }
        }
    },

    // options for 3rd party plugins
    pluginOptions: {
        gitDescribe: {
            variableName: 'GIT_DESCRIBE'
        },
        moment: {
            locales: [
                'en'
            ]
        }
    }
}
