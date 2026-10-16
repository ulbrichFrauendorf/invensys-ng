module.exports = (config) => config.set({
  frameworks: ['jasmine'],
  plugins: [require('karma-jasmine'), require('karma-chrome-launcher')],
  reporters: ['progress'],
  browsers: ['ChromeHeadlessDesktop', 'ChromeHeadlessTouch'],
  customLaunchers: {
    ChromeHeadlessDesktop: { base: 'ChromeHeadless', flags: ['--window-size=1280,900'] },
    ChromeHeadlessTouch: {
      base: 'ChromeHeadless',
      flags: ['--window-size=390,844', '--touch-events=enabled', '--blink-settings=primaryPointerType=2,availablePointerTypes=2'],
    },
  },
  singleRun: true,
});
