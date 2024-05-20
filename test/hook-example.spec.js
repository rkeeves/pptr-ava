const ava = require("ava");
const H = require("../lib/hook");
const { LoginTask, LogoutTask } = require("../app/task");
const { $dataTest } = require("../lib/by");
/**
 * @type { H.TypedTest<H.ProjectConfigState & H.BrowserState, H.AlfaState & H.BetaState> }
 */
const _ = H.typedTest(ava);

const CREDS = {
  username: "standard_user",
  password: "secret_sauce"
}

_.beforeAllHook(H.ProjectConfigHook.setup);

_.beforeAllHook(H.BrowserHook.setup);

_.beforeAll("Base login", async t => await LoginTask.loginAndLandAtInventoryPage(t.context.base.bot, CREDS));

_.beforeEachHook(H.AlfaHook.setup);

_.beforeEach("Alfa login", async t => await LoginTask.loginAndLandAtInventoryPage(t.context.alfa.bot, CREDS));

_.beforeEachHook(H.BetaHook.setup);

_.beforeEach("Beta login", async t => await LoginTask.loginAndLandAtInventoryPage(t.context.beta.bot, CREDS));

const BUTTONS = [
  'sauce-labs-backpack',
  'sauce-labs-bike-light',
  'sauce-labs-fleece-jacket',
  'sauce-labs-onesie',
  'test.allthethings()-t-shirt-(red)'
].map(nick => ({ add: $dataTest(`add-to-cart-${nick}`), rem: $dataTest(`remove-${nick}`) }))

/**
 * @param {Bot} bot
 * @param {number} i
 */
const add = async (bot, i) => {
  bot.scrollIntoView(BUTTONS[i].add);
  bot.click(BUTTONS[i].add);
  await bot.shouldBeVisible(BUTTONS[i].rem);
}
/**
 * @param {Bot} bot
 * @param {number} i
 */
const rem = async (bot, i) => {
  bot.scrollIntoView(BUTTONS[i].rem);
  bot.click(BUTTONS[i].rem);
  await bot.shouldBeVisible(BUTTONS[i].add);
}

_.test("[hook-example-00] Red", async t => {
  let bot = t.context.alfa.bot;
  await add(bot, 0);
  await add(bot, 1);
  await add(bot, 2);
  await add(bot, 4);
  bot = t.context.beta.bot;
  await add(bot, 1);
  await add(bot, 4);
  t.pass();
  bot = t.context.alfa.bot;
  await rem(bot, 0);
  await rem(bot, 1);
  await rem(bot, 2);
  await rem(bot, 4);
  bot = t.context.beta.bot;
  await rem(bot, 1);
  await rem(bot, 4);
  t.pass();
});

_.test("[hook-example-01] Blue", async t => {
  let bot = t.context.alfa.bot;
  await add(bot, 0);
  bot = t.context.beta.bot;
  await add(bot, 3);
  t.pass();
  bot = t.context.alfa.bot;
  await rem(bot, 0);
  bot = t.context.beta.bot;
  await rem(bot, 3);
  t.pass();
});

_.afterEach("Beta logout", async t => await LogoutTask.logoutViaMenu(t.context.beta.bot));

_.afterEachHook(H.BetaHook.teardown);

_.afterEach("Alfa logout", async t => await LogoutTask.logoutViaMenu(t.context.alfa.bot));

_.afterEachHook(H.AlfaHook.teardown);

_.afterAll("Base logout", async t => await LogoutTask.logoutViaMenu(t.context.base.bot));

_.afterAllHook(H.BrowserHook.teardown);

_.afterAllHook(H.ProjectConfigHook.teardown);



