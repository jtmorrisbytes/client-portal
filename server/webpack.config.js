const path = require("path");
const nodeExternals = require("webpack-node-externals");
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    library: "app",
    libraryTarget: "commonjs",
    path: path.resolve(__dirname),
  },
  target: "node",
  externals: [nodeExternals()],
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
          },
        },
      },
    ],
  },
};
