const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// Configure SVGs to be handled as React components
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],  
  sourceExts: [...config.resolver.sourceExts, 'cjs'],
  unstable_enablePackageExports: false,
};

module.exports = config;
