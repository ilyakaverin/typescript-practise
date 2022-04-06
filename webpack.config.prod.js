const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/app.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [new HtmlWebpackPlugin({
        title: 'learning webpack',
        template: './index.html'
      }),
      new CleanPlugin.CleanWebpackPlugin()
    ],
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
    },

};