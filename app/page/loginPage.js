const { Bot } = require("../../lib/bot");
const { $dataTest } = require("../../lib/by");

const $sentinel = $dataTest("login-container");
const $username = $dataTest("username");
const $password = $dataTest("password");
const $loginButton = $dataTest("login-button");

/**
 *
 * @param { Bot } bot
 */
const goto = async (bot) => await bot.gotoRelative("/")

/**
 *
 * @param { Bot } bot
 */
const shouldBeVisible = async (bot) => await bot.shouldBeVisible($sentinel);

/**
 *
 * @param { Bot } bot
 * @param { string } s
 */
const fillUsername = async (bot, s) => await bot.type($username, s);

/**
 *
 * @param { Bot } bot
 * @param { string } s
 */
const fillPassword = async (bot, s) => await bot.type($password, s);

/**
 *
 * @param { Bot } bot
 */
const clickLogin = async (bot) => await bot.click($loginButton);

module.exports = {
  goto,
  shouldBeVisible,
  fillUsername,
  fillPassword,
  clickLogin
}
