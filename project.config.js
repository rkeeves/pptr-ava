require('dotenv').config()

/**
 *
 * @returns { import("./lib/hook").ProjectConfig }
 */
const config = () => {
  const height = parseInt(process.env.BROWSER_HEIGHT ?? '768');
  const width = parseInt(process.env.BROWSER_WIDTH ?? '1024');
  return {
    botOpts: {
      baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com',
      retryDurationMs: parseInt(process.env.RETRY_DURATION_MS ?? '3000'),
      retryIntervalMs: parseInt(process.env.RETRY_INTERVAL_MS ?? '300'),
    },
    launch: {
      slowMo: parseInt(process.env.SLOWMO ?? '0'),
      headless: process.env.HEADLESS == "false" ? false : "new",
      args: [`--window-size=${width},${height}`],
      defaultViewport: {
        height: height,
        width: width
      }
    }
  }
};

module.exports = config
