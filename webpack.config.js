const path = require('path');
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');
const jsonImporter = require('node-sass-json-importer');
const { readdirSync, existsSync } = require('fs');

module.exports = env => {

    const rootPath = __dirname;
    let watch = false;

    if(env==="development") {
        watch = true;
    }

    const patternsSrcDir = __dirname + "/src/patterns";
    const patternsHtml = readdirSync(patternsSrcDir).map(entryName => {
        return new HtmlWebpackPlugin({
            filename: "patterns/" + entryName + '.html',
            template: patternsSrcDir + `/${entryName}/${entryName}.twig`,
            inject: true
        });
    });

    const indexHtml = new HtmlWebpackPlugin({
        filename: "index.html",
        template: patternsSrcDir + `/../index.twig`,
        inject : true
    });

    return {
        entry: {main: './src/index.js'},
        mode: env,
        devtool: 'source-map',
        watch,
        watchOptions: {
            ignored: /node_modules/
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[chunkhash].js'
        },
        devServer: {
            contentBase: path.resolve(__dirname, 'dist'),
            watchContentBase: true,
            compress: true,
            port: 9001,
            open: true,
            liveReload: true
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        "style-loader",
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1
                            },
                        },
                        {
                            loader : "sass-loader",
                            options: {
                                sassOptions: {
                                    includePaths: [__dirname + '/**/*.scss'],
                                    importer: jsonImporter()
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.twig$/,
                    use: [
                        'raw-loader',
                        {
                            loader : 'twig-html-loader',
                            options: {
                                data: (context) => {
                                    const data = path.join(
                                        context.resourcePath.substr(
                                            0,
                                            context.resourcePath.lastIndexOf(".")) + ".json"
                                    );
                                    if(existsSync(data)) {
                                        context.addDependency(data);
                                        return context.fs.readJsonSync(data, {throws: false}) || {};
                                    }

                                    return {};
                                },
                                namespaces: {
                                    'templates': rootPath + '/src/templates'
                                }
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin({
                dry: false,
                verbose: true,
                cleanStaleWebpackAssets: true,
                protectWebpackAssets: false,
                cleanOnceBeforeBuildPatterns: ['**/*']
            }),
            new MiniCssExtractPlugin({
                filename: "style.[contenthash].css"
            }),
            new webpack.WatchIgnorePlugin([
                path.join(__dirname, "node_modules")
            ])
        ].concat(patternsHtml).concat(indexHtml)
    }
};