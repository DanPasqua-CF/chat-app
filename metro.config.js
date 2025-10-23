const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// Configure SVGs to be handled as React components
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...config.resolver,
  // Remove 'svg' from assetExts so Metro treats them as source files
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
  // Add 'svg' to sourceExts so they are processed by the transformer
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};

module.exports = config;
