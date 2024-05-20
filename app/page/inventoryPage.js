const { Bot } = require("../../lib/bot");
const { $dataTest } = require("../../lib/by");

const $sentinel = $dataTest("inventory-container");

/**
 *
 * @param { Bot } bot
 */
const goto = async (bot) => await bot.gotoRelative("/inventory.html");

/**
 *
 * @param { Bot } bot
 */
const shouldBeVisible = async (bot) => await bot.shouldBeVisible($sentinel);

module.exports = {
  goto,
  shouldBeVisible
}
