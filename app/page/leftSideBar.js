const { Bot } = require("../../lib/bot");
const { $css, $dataTest } = require("../../lib/by");

const $sentinel = $css(".bm-menu-wrap");
const $openMenu = $css("#react-burger-menu-btn");
const $logoutLink = $dataTest("logout-sidebar-link");

/**
 *
 * @param { Bot } bot
 */
const open = async (bot) => await bot.click($openMenu);

/**
 *
 * @param { Bot } bot
 */
const shouldBeOpened = async (bot) => await bot.shouldBeStable($sentinel);

/**
 *
 * @param { Bot } bot
 */
const clickLogout = async (bot) => await bot.click($logoutLink);

module.exports = {
  open,
  shouldBeOpened,
  clickLogout
}
