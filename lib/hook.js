const { Bot } = require("./bot");
const pptr = require("puppeteer");

/**
 * @template A
 * @typedef { import("ava").BeforeInterface<A> } Before
 */

/**
 * @template A
 * @typedef { import("ava").AlwaysInterface<A> } After
 */

/**
 * @template A
 * @template E
 * @typedef {{
*   beforeAll: Before<A>;
*   beforeAllHook: (f: (_: Before<A>) => void);
*   beforeEach: Before<A & E>;
*   beforeEachHook: (f: (_: Before<A & E>) => void);
*   test: (title: string, implementation: import("ava").Implementation<A & E>) => void;
*   afterEach: After<A & E>;
*   afterEachHook: (f: (_: After<A & E>) => void);
*   afterAll: After<A>;
*   afterAllHook: (f: (_: After<A>) => void);
* }} TypedTest
*/

/**
* @template A
* @template E
* @param {import("ava").TestInterface<unknown>} ava
* @returns {TypedTest<A, E>}
*/
const typedTest = (ava) => ({
  beforeAll: ava.serial.before,
  beforeAllHook: f => f(ava.serial.before),
  beforeEach: ava.serial.beforeEach,
  beforeEachHook: f => f(ava.serial.beforeEach),
  test: ava,
  afterEach: ava.serial.afterEach.always,
  afterEachHook: f => f(ava.serial.afterEach.always),
  afterAll: ava.serial.after.always,
  afterAllHook: f => f(ava.serial.after.always),
});

/**
 * @typedef {{
 *   launch: import("puppeteer").PuppeteerLaunchOptions;
 *   botOpts: import("./bot").BotOpts;
 * }} ProjectConfig
 */

/**
 * @typedef {{
 *   config: ProjectConfig
 * }} ProjectConfigState
 */

/**
 * @typedef {{
 *    base: {
 *      browser: import("puppeteer").Browser;
 *      bot: Bot;
 *    }
 * }} BrowserState
 */

/**
 * @typedef {{
 *    alfa: {
 *      bot: Bot;
 *    }
 * }} AlfaState
 */

/**
 * @typedef {{
 *    beta: {
 *      bot: Bot;
 *    }
 * }} BetaState
 */

/**
 * @template A
 * @typedef {{
 *  setup: (_: Before<A>) => void;
 *  teardown: (_: After<A>) => void;
 * }} Hook
 */

/**
 *
 * @type {Hook<ProjectConfigState & BrowserState>}
 */
const ProjectConfigHook = {
  setup: f => f("setup projectConfig", async t => {
    const config = require("../project.config")();
    t.context.config = config;
  }),
  teardown: f => f("teardown projectConfig", async t => {
    if (t.context.config) {
      delete t.context.config;
    }
  })
}

/**
 *
 * @type {Hook<ProjectConfigState & BrowserState>}
 */
const BrowserHook = {
  setup: f => f("setup browser", async t => {
    const browser = await pptr.launch(t.context.config.launch);
    const botOpts = t.context.config.botOpts;
    const page = await browser.defaultBrowserContext().pages().then(xs => xs[0]);
    t.context.base = {
      browser,
      bot: Bot.make(page, botOpts)
    };
  }),
  teardown: f => f("teardown browser", async t => {
    if (t.context.base) {
      await t.context.base.browser.close();
      delete t.context.base;
    }
  })
}

/**
 *
 * @type {Hook<ProjectConfigState & BrowserState & AlfaState>}
 */
const AlfaHook = {
  setup: f => f("setup alfa", async t => {
    const botOpts = t.context.config.botOpts;
    const browser = t.context.base.browser;
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    t.context.alfa = { bot: Bot.make(page, botOpts) };
  }),
  teardown: f => f("teardown alfa", async t => {
    if (t.context.alfa) {
      await t.context.alfa.bot.page.browserContext().close();
      delete t.context.alfa;
    }
  })
}

/**
 *
 * @type {Hook<ProjectConfigState & BrowserState & BetaState>}
 */
const BetaHook = {
  setup: f => f("setup beta", async t => {
    const botOpts = t.context.config.botOpts;
    const browser = t.context.base.browser;
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    t.context.beta = { bot: Bot.make(page, botOpts) };
  }),
  teardown: f => f("teardown beta", async t => {
    if (t.context.beta) {
      await t.context.beta.bot.page.browserContext().close();
      delete t.context.beta;
    }
  })
}

module.exports = {
  typedTest,
  ProjectConfigHook,
  BrowserHook,
  AlfaHook,
  BetaHook
}
