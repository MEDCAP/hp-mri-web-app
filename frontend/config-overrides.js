const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add a fallback for the 'stream' module
  config.resolve.fallback = config.resolve.fallback || {};
  config.resolve.fallback.stream = require.resolve('stream-browserify');

  // Return the updated configuration
  return config;
};
