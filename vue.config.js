const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const debug = process.env.NODE_ENV !== 'production'
// let cesiumSource = './node_modules/cesium/Source'
// let cesiumWorkers = '../Build/Cesium/Workers'
module.exports = {
    // publicPath: process.env.NODE_ENV === 'production' ? '/disaster/' : '/',
    publicPath: './',    //这个值在开发环境下同样生效！！！
    devServer: {
        port: 8099 //修改服务端口号
    },
    outputDir: 'disaster', //设置 build 输出目录
    configureWebpack: {
        output: {
            sourcePrefix: ' '
        },
        amd: {
            toUrlUndefined: true
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': path.resolve('src'),
                // 'cesium': path.resolve(__dirname, cesiumSource)
            }
        },
        plugins: [
            // new CopyWebpackPlugin([ { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers'}]),
            // new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Assets'), to: 'Assets'}]),
            // new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'}]),
            // new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers'}]),
            new webpack.DefinePlugin({
                CESIUM_BASE_URL: JSON.stringify('./')
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                'window.$': 'jquery'
            })

        ],  
        module: {
            unknownContextCritical: /^.\/.*$/,
            unknownContextCritical: false

        }
    }
}
