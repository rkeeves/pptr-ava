const pptr = require("puppeteer");
const { $dataTest, $css, $text } = require("../lib/by");
const { Bot } = require("../lib/bot");
const config = require("../project.config")();
/**
 * @type {import("ava").TestInterface<{ browser: pptr.Browser, bot: Bot }>}
 */
const test = require("ava");

test.before("spawn browser", async t => {
  t.context.browser = await pptr.launch(config.launch);
});

test.beforeEach("spawn browserContext", async t => {
  const browserContext = await t.context.browser.createIncognitoBrowserContext();
  t.context.bot = Bot.make(await browserContext.newPage(), config.botOpts);
});

test("[bot-example-00] login to sauce demo and logout", async t => {
  const bot = t.context.bot;
  await bot.gotoRelative("/");
  await bot.shouldBeVisible($dataTest("login-container"));
  await bot.type($dataTest("username"), "standard_user");
  await bot.type($dataTest("password"), "secret_sauce");
  await bot.click($dataTest("login-button"));
  await bot.shouldBeVisible($dataTest("inventory-container"));
  await bot.shouldBeVisible($text("Products"));
  await bot.click($css("#react-burger-menu-btn"));
  await bot.shouldBeStable($css(".bm-menu-wrap"));
  await bot.click($dataTest("logout-sidebar-link"));
  await bot.shouldBeVisible($dataTest("login-container"));
  t.pass();
});

test("[bot-example-01] dynamic content", async t => {
  const bot = t.context.bot;
  await bot.goto("https://the-internet.herokuapp.com/dynamic_controls");
  await bot.click($css("#input-example > button"));
  await bot.withBotOpts(o => ({ ...o, retryDurationMs: 5 * 1000 })).shouldBeEditable($css("#input-example > input"));
  await bot.shouldHaveInnerTextMatching($css("#input-example #message"), /^.*It's enabled!.*/);
  t.pass();
});

test("[bot-example-02] expecting value of an element", async t => {
  const bot = t.context.bot;

  const $uname = $dataTest("username");

  await bot.gotoRelative("/");
  await bot.type($uname, "user123");
  await bot.shouldHaveValueEq($uname, "user123");
  await bot.shouldHaveValueMatching($uname, /[u]se.123/);
  t.pass();
});

test.afterEach.always("despawn browserContext", async t => {
  await t.context.bot.page.browserContext().close();
})

test.after.always("despawn browser", async t => {
  await t.context.browser.close();
});
