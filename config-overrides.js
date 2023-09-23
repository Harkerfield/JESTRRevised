const CopyPlugin = require('copy-webpack-plugin');

module.exports = function override(config, env) {
    // Add the copy plugin to the webpack plugins array
    config.plugins.push(
        new CopyPlugin({
            patterns: [
                { from: 'src/settings', to: 'build/settings' },
            ],
        })
    );

    return config;
};
