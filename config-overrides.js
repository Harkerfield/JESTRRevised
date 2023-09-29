module.exports = function override(config, env) {
  if (env === "production") {
    // Production-specific configuration
    config.output.publicPath = "/sites/354RANS/hafi/tester";
  } else {
    // Development-specific configuration
    config.output.publicPath = "/";
  }

  return config;
};

// const CopyPlugin = require('copy-webpack-plugin');

// module.exports = function override(config, env) {
//     // Add the copy plugin to the webpack plugins array
//     config.plugins.push(
//         new CopyPlugin({
//             patterns: [
//                 { from: 'src/settings', to: 'build/settings' },
//             ],
//         })
//     );

//     return config;
// };
