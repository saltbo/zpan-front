
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const path = require('path');
const resolve = (dir) => {
    return path.join(__dirname, dir)
}

const cdn = {
    externals: {
        'vue': 'Vue',
        'vuex': 'Vuex',
        'vue-router': 'VueRouter',
        'element-ui': 'ELEMENT',
        'photoswipe': 'PhotoSwipe',
        'moment': 'moment',
    },
    css: [
        'https://cdn.jsdelivr.net/npm/element-ui@2.15.5/lib/theme-chalk/index.css'
    ],
    js: [
        "https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js",
        "https://cdn.jsdelivr.net/npm/vuex@3.6.2/dist/vuex.min.js",
        "https://cdn.jsdelivr.net/npm/vue-router@3.5.2/dist/vue-router.min.js",
        "https://cdn.jsdelivr.net/npm/element-ui@2.15.5/lib/index.js",
        "https://cdn.jsdelivr.net/npm/photoswipe@4.1.3/dist/photoswipe.min.js",
        "https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js"
    ]
};

module.exports = {
    // Project deployment base
    publicPath: '/',

    // where to output built files
    // 打包后的输出目录
    outputDir: 'dist',

    // whether to use eslint-loader for lint on save.
    lintOnSave: false,

    // tweak internal webpack configuration.
    chainWebpack: config => {
        config.when(process.env.NODE_ENV !== 'development', //生产环境才做处理
            config => {
                config.plugin('html-index').tap(args => {
                    args[0].cdn = cdn
                    return args
                })
                config.optimization.splitChunks({
                    chunks: 'async',
                    minSize: 30000,
                    maxSize: 0,
                    minChunks: 1,
                    maxAsyncRequests: 6,
                    maxInitialRequests: 4,
                    automaticNameDelimiter: '~',
                    cacheGroups: {
                        vendors: {
                            name: `chunk-vendors`,
                            test: /[\\/]node_modules[\\/]/,
                            priority: -10,
                            chunks: 'initial'
                        },
                        common: {
                            name: `chunk-common`,
                            minChunks: 2,
                            priority: -20,
                            chunks: 'initial',
                            reuseExistingChunk: true
                        }
                    }
                })
            }
        )
    },

    configureWebpack: config => {
        config.resolve = {
            extensions: ['.js', '.vue', '.json', ".css"],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': resolve('src'),
            }
        };
        // 生产环境相关配置cdn/gzip压缩
        if (process.env.NODE_ENV !== 'development') {
            config.externals = cdn.externals
        }
    },

    // generate sourceMap for production build?
    productionSourceMap: process.env.NODE_ENV !== 'production',

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
            '^/api': {
                target: 'http://localhost:8222',
                ws: true,
                changeOrigin: true
            },
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
        },
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: true
        },
        'style-resources-loader': {
            preProcessor: 'stylus',
            patterns: []
        }
    }
}
