const path = require("path")

module.exports = {
  entry: "./src/App.js",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "public"),
    filename: "bundled.js"
  },
  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, "public"),
    hot: true,
    historyApiFallback: { index: "index.html" }
  },
  mode: "development",
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
            loader: "file-loader"
          }
        ]
      }
    ]
  }
}
