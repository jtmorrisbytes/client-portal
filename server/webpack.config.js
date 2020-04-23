const path = require("path");
const nodeExternals = require("webpack-node-externals");
const { name } = require("./package.json");
module.exports = {
  entry: "./src/index.mjs",
  output: {
    filename: "index.js",
    library: name || "app",
    libraryTarget: "commonjs",
    path: path.resolve(__dirname),
  },
  target: "node",
  // externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|spec|\$Recycle.Bin)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              // "@babel/plugin-transform-async-to-generator",
              "@babel/plugin-transform-runtime",
            ],
            target: "node",
          },
        },
      },
    ],
  },
};
