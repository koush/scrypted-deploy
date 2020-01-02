const path = require('path');
const fs = require('fs');
const InjectPlugin = require('webpack-inject-plugin').default;
const webpack = require('webpack');
const duk = require('./transform/generator');

var out;
const cwd = process.cwd();

if (process.env.NODE_ENV == 'production') {
    out = path.resolve(cwd, 'dist');
}
else {
    out = path.resolve(cwd, 'out');
}

const isProduction = process.env.NODE_ENV == 'production';

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    output: {
        devtoolModuleFilenameTemplate: function (info) {
            return path.relative(out, info.absoluteResourcePath);
        },

        // export everything to a var "window" which will be an alias for "exports" in Scrypted
        libraryTarget: "window",
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                // unsure if this is correct... need to transpile node modules at times.
                // exclude: /(node_modules|bower_components)/,
                exclude: /(core-js)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        "plugins": [
                            // path.resolve(__dirname, "./transform/generator"),
                            "@babel/plugin-transform-typescript",
                            "@babel/plugin-proposal-class-properties",
                            "@babel/plugin-transform-modules-commonjs",
                            [
                                "@babel/plugin-transform-arrow-functions",
                                {
                                    spec: true,
                                },
                            ],
                        ],
                        "presets": [
                            [
                                "@babel/preset-env",
                                {
                                    "targets": {
                                        "chrome": "78",
                                    },
                                    "useBuiltIns": "usage",
                                    "corejs": "2",
                                },
                                "@babel/typescript",
                            ],
                        ]
                    }
                }
            },

            // {
            //     test: /\.tsx?$/,
            //     loader: 'ts-loader',
            //     exclude: /node_modules/,
            //     options: {
            //         configFile : path.join(__dirname, 'tsconfig.json'),
            //     },
            
            // }

        ]
    },

    externals: {
        "core-js/modules/es6.typed.uint8-array": "Uint8Array",
    },

    node: {
        // quickjs has no Buffer
        Buffer: true,
        __dirname: true,
    },

    resolve: {
        alias: {
            ByteBuffer: "bytebuffer",
            Long: "long",

            // browser provide plugin polyfills
            _websocket: path.resolve(__dirname, 'polyfill/websocket.js'),

            // node polyfills
            dgram: path.resolve(__dirname, 'polyfill/dgram'),
            cluster: path.resolve(__dirname, 'polyfill/cluster'),
            os: path.resolve(__dirname, 'polyfill/os'),
            net: path.resolve(__dirname, 'polyfill/net'),
            tls: path.resolve(__dirname, 'polyfill/tls'),
            fs: path.resolve(__dirname, 'polyfill/fs'),
            mdns: path.resolve(__dirname, 'polyfill/mdns'),
            buffer: path.resolve(__dirname, 'polyfill/buffer'),
            buffertools: path.resolve(__dirname, 'node_modules/browserify-buffertools'),
            'safe-buffer': path.resolve(__dirname, 'polyfill/safe-buffer'),

            // 'duktape-yield': path.resolve(__dirname, 'transform/duktape-yield'),
        },

        extensions: ['.tsx', '.ts', '.js']
    },

    stats: {
        colors: true
    },

    plugins: [
        new InjectPlugin(function () {
            return ''
            // + fs.readFileSync(path.resolve(__dirname, 'inject/buffer.js'))
            + fs.readFileSync(path.resolve(__dirname, 'inject/xmlhttprequest.js'))
            + fs.readFileSync(path.resolve(__dirname, 'inject/inject.js'))
            ;
        }),
        new webpack.DefinePlugin({
            'process.env.SSDP_COV': false,
        }),
        new webpack.ProvidePlugin({
            WebSocket: '_websocket'
        }),
    ],

    optimization: {
        // can not minimize since duktape only does line based breakpoints
        // so only minimize in production.
        // UPDATE: this may not be true. unable to determine cause. could be
        // some textarea copy paste behavior that occurred while I was testing.
        // minimize: false,
        minimize: isProduction,
    },

    // don't bother doing source maps in production:
    // compressed code is on one line which can't be debugged by duktape anyways.
    // see optimization comment above.
    // this also reduces the package size.
    devtool: isProduction ? 'none' : 'source-map',
};