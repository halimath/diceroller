const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: "development",
    entry: "./src/script/index.ts",
    output: {
        filename: "diceroller.js"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: "ts-loader"
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                      loader: 'css-loader'
                    },
                    {
                      loader: 'sass-loader',
                      options: {
                        sourceMap: true,
                        // options...
                      }
                    }
                  ]
            }            
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/diceroller.css'
        }),
    ],
    resolve: {
        extensions: [".ts", ".js", ".html"],
        plugins: [new TsconfigPathsPlugin()]
    },
    devServer: {
        contentBase: "./public",
        compress: true,
        host: "0.0.0.0",
        port: 9999,
        open: true,
        openPage: 'http://localhost:9999'
    }
};