const path = require('path'); //CommonJS
const MiniCssExtractPlugin = ('MiniCssExtractPluginmini-css-extract-plugin')

module.exports = {
mode: "production",
entry: "./frontend/main.js",
output: {
    path : path.resolve(__dirname, 'public', 'assets', 'js'),
    filename: 'bundle.js'
},
module: {
    rules: [{
        exclude: /node_modules/,
        test:/\.js$/,
        use: {
            loader:'babel-loader',
            options: {
                presets: ['@babel/env']
            }
        }
    },
    {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../css/style.css' // salva em public/assets/css/style.css
    })
  ],
  devtool: 'source-map'
};