const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    target: 'web',
    plugins: [
      new MiniCssExtractPlugin({
        filename: '../css/[name].css',
        chunkFilename: '../css/[id].css',
      }),
    ],
    entry: {
        main: './src/scripts/entry.js',
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, '_site/dist/scripts'),
    },
    module: {
        rules: [
          {
            test: /.scss$/,
            use: [
              // process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
              // MiniCssExtractPlugin.loader,
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: (resourcePath, context) => {
                    // publicPath is the relative path of the resource to the context
                    // e.g. for ./css/admin/main.css the publicPath will be ../../
                    // while for ./css/main.css the publicPath will be ../
                    return path.relative(path.dirname(resourcePath), context) + '/';
                  },
                },
              },
              {
                loader: 'css-loader',
                options: { importLoaders: 1 },
              },
              {
                loader: 'sass-loader',
              },
            ],
          },
        ],
    },
};