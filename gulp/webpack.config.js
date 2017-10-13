/**
 * webpack 配置文件
 */
const polyfill          = require("babel-polyfill");
const webpack           = require('webpack');
const minimist          = require('minimist');
const path              = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rootDir           = path.resolve(process.cwd(), '');
const config            = require("./config");
const moduleConfig      = require(path.join(rootDir,"src/moduleConfig"));
const modeOptions       = {string: 'env',default: { env: process.env.NODE_ENV || 'dev' }};
const mode              = minimist(process.argv.slice(2), modeOptions);
const envConfig         = config[mode.env];
const UglifyJSPlugin    = require('uglifyjs-webpack-plugin');

//修改界定符
const template = require('art-template');
template.defaults.rules[0].test=/{%(#?)((?:==|=#|[=-])?)([\w\W]*?)(-?)%}/;
template.defaults.rules[1].test=/{\[([@#]?)(\/?)([\w\W]*?)]}/;

const publicPath = mode.env === "dev" ? "/assets/" : "./assets/";
const devtool = mode.env !== "production" ? "eval" : "source-map";
const entry = mode.env === "dev" ? { app: ["webpack-hot-middleware/client?reload=true&noInfo=true", path.join(process.cwd(), "src/app.js")] } : { app:[path.join(process.cwd(), "src/app.js")]};

entry.app.unshift("babel-polyfill");

const webpackConfig = {
    devtool: devtool,
    entry: entry,
    output: {
        filename: "js/[name].js",
        path: path.join(process.cwd(), 'dist', 'assets'),
        publicPath: publicPath,
        chunkFilename: "js/ensure/[name]-[id]-[chunkhash].js",
        libraryTarget: 'umd'
    },
    resolve: {
        modules: [
            "node_modules",
            path.join(rootDir, "src/")
        ],
        alias: moduleConfig.alias
    },
    module: {
        //配置loader规则
        rules:[{
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        },{
            test: /\.less$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "less-loader", 
                options: {
                    noIeCompat: true
                }
            }]
        },{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['es2015', { modules: false }]
                    ],
                    plugins: ['syntax-dynamic-import']
                }
            }]
        },{ 
            test: /\.(html|tpl)$/, 
            loader: "art-template-loader" 
        }]
       
        
    },
    plugins: [
        new webpack.ProvidePlugin(moduleConfig.global),
        new webpack.DefinePlugin({
            'baseEnv': JSON.stringify(envConfig.baseEnv),
        }),
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new HtmlWebpackPlugin({
            filename: path.join(rootDir, "dist/index.html"),
            template: path.join(rootDir, "src/modules/index.html"),
            publicPath: config.dev.publicPath,
            hash: true
        })
    ],
};


// 压缩混淆JS
if(mode.env === 'dev'){
    webpackConfig.plugins.unshift(new webpack.optimize.OccurrenceOrderPlugin(),new webpack.NoEmitOnErrorsPlugin(),new webpack.HotModuleReplacementPlugin());
}else if(mode.env === 'production'){
    webpackConfig.plugins.unshift(new UglifyJSPlugin({
        compress: { warnings: false },
        sourceMap: true
    }));
}

module.exports = webpackConfig;
