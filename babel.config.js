// babel.config.js
module.exports = function (api) {
  api.cache(true); // This is a performance optimization

  return {
    presets: ['module:@react-native/babel-preset'], // Your existing presets
    plugins: [
      // Your existing plugins (e.g., 'react-native-reanimated/plugin')
      'react-native-reanimated/plugin',
      ['module:react-native-dotenv'],
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            'moti/skeleton': 'moti/skeleton/react-native-linear-gradient',
          },
        },
      ],
    ],
  };
};