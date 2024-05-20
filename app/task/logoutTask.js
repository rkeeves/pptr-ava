const { Bot } = require("../../lib/bot");

const { LeftSideBar, LoginPage } = require("../page");

/**
 *
 * @param {Bot} bot
 */
const logoutViaMenu = async (bot) => {
  await LeftSideBar.open(bot);
  await LeftSideBar.shouldBeOpened(bot);
  await LeftSideBar.clickLogout(bot);
  await LoginPage.shouldBeVisible(bot);
}

module.exports = {
  logoutViaMenu
};
