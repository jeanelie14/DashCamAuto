const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    alias: {
      // Fix for RxJS module resolution issues
      'rxjs/internal/operators/connect': 'rxjs/operators',
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
