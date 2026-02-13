const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    buffer: require.resolve("buffer/"),
    timers: require.resolve("timers-browserify"),
    process: require.resolve("process/browser.js"),
    stream: require.resolve("stream-browserify"),
  };

  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser.js",
    }),
  ];

  // Fix axios strict ESM resolution
  config.module.rules.push({
    test: /\.m?js$/,
    include: /node_modules[\\/]axios/,
    resolve: {
      fullySpecified: false,
    },
  });

  return config;
};
