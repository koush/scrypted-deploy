const path = require('path');
const fs = require('fs');
const InjectPlugin = require('webpack-inject-plugin').default;
const webpack = require('webpack');

var out;
const cwd = process.cwd();

if (process.env.NODE_ENV == 'production') {
    out = path.resolve(cwd, 'dist');
}
else {
    out = path.resolve(cwd, 'out');
}

//
var files;
try {
    var filesDir = path.resolve(cwd, 'fs');
    files = [];
    function packageDirectory(root, filesDir) {
        var dirents = fs.readdirSync(path.resolve(root, filesDir), {
            withFileTypes: true,
        });
    
        for (var dirent of dirents) {
            if (dirent.isDirectory()) {
                packageDirectory(root, path.join(filesDir, dirent.name));
            }
            else if (dirent.isFile()) {
                var rootPath = path.join(filesDir, dirent.name);
                var filePath = path.resolve(root, filesDir, dirent.name);
                files.push(`require('fs').registerFile('/${rootPath}', require('raw-loader!${filePath}'))`)
            }
        }
    }
    packageDirectory(filesDir, '.');
    if (files.length) {
        files = files.join('\n') + '\n';
        console.error(files);
    }
    else {
        files = '';
    }
}
catch (e) {
    files = '';
}

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
                            "@babel/plugin-transform-typescript",
                            "@babel/plugin-proposal-class-properties",
                            "@babel/plugin-transform-modules-commonjs"
                        ],
                        "presets": [
                            [
                                "@babel/preset-env",
                                {
                                    "useBuiltIns": "usage",
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
        // the duktape buffer polyfill is somewhat incomplete and does not
        // support encodings.
        // you may want to change this to true, but this will increase the
        // webpack size, and net code may no longer unless the polyfill buffer
        // is converted back to a Duktape buffer.
        Buffer: false,
        __dirname: true,
    },

    resolve: {
        alias: {
            ByteBuffer: "bytebuffer",
            Long: "long",
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
        },

        extensions: ['.tsx', '.ts', '.js']
    },

    stats: {
        colors: true
    },

    plugins: [
        new InjectPlugin(function () {
            return files + fs.readFileSync(path.resolve(__dirname, 'inject/inject.js'));
        }),
        new webpack.DefinePlugin({
            'process.env.SSDP_COV': false,
        })
    ],

    optimization: {
        // can not minimize since duktape only does line based breakpoints
        // so only minimize in production.
        // UPDATE: this may not be true. unable to determine cause. could be
        // some textarea copy paste behavior that occurred while I was testing.
        // minimize: false,
        minimize: process.env.NODE_ENV == 'production',
    },

    devtool: 'source-map'
};
