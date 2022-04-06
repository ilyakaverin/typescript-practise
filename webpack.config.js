const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/app.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'auto'
    },
    devtool: 'inline-source-map',
    plugins: [new HtmlWebpackPlugin({
        title: 'learning webpack',
        template: './index.html'
      })],
    module: {
        rules: [
            {
                test: /\.ts$/, // this regexp tells wbp to check files that ends with .ts
                use: 'ts-loader',
                exclude: /node_modules/, 

            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
              }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
};