const currentTask = process.env.npm_lifecycle_event
const path = require("path")
const Dotenv = require("dotenv-webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const fse = require("fs-extra")
console.log("config:", currentTask)

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy files", function () {
      fse.copySync("./public/main.css", "./dist/main.css")
    })
  }
}

const config = {
  entry: "./src/App.js",
  mode: "development",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "public"),
    filename: "bundled.js"
  },
  plugins: [new Dotenv(), new HtmlWebpackPlugin({ template: "./public/index.html" })],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", ["@babel/preset-env", { targets: { node: "12" } }]]
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]"
            }
          }
        ]
      }
    ]
  }
}

if (currentTask == "webpackDev" || currentTask == "dev") {
  config.devtool = "source-map"
  config.devServer = {
    port: 3000,
    contentBase: path.join(__dirname, "public"),
    hot: true,
    historyApiFallback: { index: "index.html" }
  }
}

if (currentTask == "webpackBuild" || currentTask == "build") {
  config.plugins.push(new CleanWebpackPlugin(), new RunAfterCompile())
  config.mode = "production"
  config.output = {
    publicPath: "./",
    path: path.resolve(__dirname, "dist"),
    filename: "bundled.js",
    chunkFilename: "[name].[chunkhash].js"
  }
}

module.exports = config
