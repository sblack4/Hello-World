module.exports = {
    entry: './app.ts',
    output: {
        filename: 'bundle.js'
    },
    devtool: "source-map",
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        preLoaders: [
          {
              test: /\.js$/,
              loader: "source-map-loader"
          }
        ],
        loaders: [
          // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
          { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    }
}