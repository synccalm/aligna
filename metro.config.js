const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  // your overrides go here (if any)
};

module.exports = mergeConfig(defaultConfig, config);
