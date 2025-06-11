module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // NO plugins needed for NativeWind v4
  };
};