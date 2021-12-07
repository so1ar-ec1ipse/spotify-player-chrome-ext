const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CopyPlugin = require("copy-webpack-plugin");
// const baseManifest = require("manifest.json");
const WebpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Spotify Controller", // change this to your app title
      meta: {
        charset: "utf-8",
        viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
        "theme-color": "#000000"
      },
      manifest: "manifest.json",
      filename: "index.html",
      template: "index.html",
      hash: true
    }),
    // new CopyPlugin([
    //   {
    //     from: "assets",
    //     to: "icons"
    //   }
    // ]),
    // new WebpackExtensionManifestPlugin({
    //   config: {
    //     base: baseManifest
    //   }
    // })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  }
}