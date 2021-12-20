const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const package = require("./manifest.json");
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const CopyWebpackPlugin = require("copy-webpack-plugin");

// function modify(buffer) {
//   // copy-webpack-plugin passes a buffer
//   const manifest = JSON.parse(buffer.toString());

//   // make any modifications you like, such as
//   manifest.version = package.version;

//   // pretty print to JSON with two spaces
//   manifest_JSON = JSON.stringify(manifest, null, 2);
//   return manifest_JSON;
// }

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    main: "./src/index.js",
    vendor: "./src/vendor.js",
    background: "./src/background.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./manifest.json",
        },
        {
          from: "./src/assets", to: "assets"
        }
      ]

    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      // {
      //   test: /\.(svg|png|jpg)$/,
      //   type: 'asset/resource',
      //   use: {
      //     loader: "file-loader",
      //     options: {
      //       name: "[name].[hash].[ext]",
      //     }
      //   }
      // }
    ]
  }
}