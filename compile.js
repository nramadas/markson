var webpack = require("webpack");
var argv = require("yargs").argv;
var notifier = require("node-notifier");
var path = require("path");

var compiler = webpack({
  entry: './index.es6',
  output: {
    path: path.join(__dirname),
    filename: "index.js",
    library: "index.js",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: ['', '.es6'],
  },
  module: {
    loaders: [
      {
        test: /\.es6/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: [
            'es2015',
            'stage-2',
            'react',
          ],
          plugins: [
            'transform-class-properties'
          ],
        },
      },
    ],
  },
  externals: {
    'babel-core': 'commonjs babel-core',
  },
});

function formatAsset(asset) {
  var name = asset.name;
  var size = asset.size;
  var sizeStr = size + " B";

  if (size > 1000) sizeStr = Math.ceil(size / 1000) + " kB";
  if (size > 1000000) sizeStr = Math.ceil(size / 1000000) + " MB";

  return name + " [" + sizeStr + "]";
}

if (argv.watch) {
  compiler.watch({}, (err, stats) => {
    if (!err) {
      console.log(stats.toString({
        colors: true,
        chunks: false,
        version: false,
      }));

      var s = stats.toJson();

      if (s.errors && s.errors.length) {
        notifier.notify({
          "title": "ERROR!",
          "message": "Check the console for errors",
        });
      } else {
        notifier.notify({
          "title": "Build complete",
          "message": s.assets.map(formatAsset).join("\n"),
        });
      }
    }
  });
} else {
  compiler.run(function(err, stats) {
    console.log(stats.toString({
      colors: false,
      chunks: false,
      version: false,
    }));
  });
}
