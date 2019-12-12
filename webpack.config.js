const path = require('path');
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');
const jsonImporter = require('node-sass-json-importer');
const { readdirSync } = require('fs');

module.exports = env => {

    const rootPath = __dirname;
    let watch = false,
        htmlMinify = {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true
        };

    if(env==="development") {
        watch = true;
        htmlMinify = false;
    }

    const patternsSrcDir = __dirname + "/src/patterns";
    const patternsHtml = readdirSync(patternsSrcDir).map(function(entryName) {
        return new HtmlWebpackPlugin({
            filename: "patterns/" + entryName + '.html',
            template: patternsSrcDir + `/${entryName}/${entryName}.twig`,
            //minify: htmlMinify,
            inject: true
        });
    });
    const indexHtml = new HtmlWebpackPlugin({
            filename: "./index.html",
            template: patternsSrcDir + `/../index.twig`,
            //minify: htmlMinify,
            inject : true
        });

    const pagesHtml = Object.assign(patternsHtml, indexHtml);

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
                                    includePaths: [path.resolve(__dirname, 'src')],
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
                                    const data =
                                        path.join(
                                            context.resourcePath.substr(
                                                0,
                                                context.resourcePath.lastIndexOf(".")) + ".json"
                                        );
                                    context.addDependency(data);
                                    return context.fs.readJsonSync(data, { throws: false }) || {};
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
        ].concat(pagesHtml)
    }
};