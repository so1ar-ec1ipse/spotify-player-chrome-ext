const path = require("path")
const common = require("./webpack.common")
const { merge } = require("webpack-merge");

module.exports = merge(common, {
  mode: "development",
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
    ]
  }
})