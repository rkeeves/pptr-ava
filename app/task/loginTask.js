const { Bot } = require("../../lib/bot");

const { LoginPage, InventoryPage } = require("../page");

/**
 *
 * @param {Bot} bot
 * @param {{ username: string; password: string; }} o
 */
const loginAndLandAtInventoryPage = async (bot, { username, password }) => {
  await LoginPage.goto(bot);
  await LoginPage.shouldBeVisible(bot);
  await LoginPage.fillUsername(bot, username);
  await LoginPage.fillPassword(bot, password);
  await LoginPage.clickLogin(bot);
  await InventoryPage.shouldBeVisible(bot);
}

module.exports = {
  loginAndLandAtInventoryPage
};
