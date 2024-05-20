const By = require("./by")
const { visible, stable, find, exists, hidden, firstToReceiveClick, enabled, innerTextEq, innerTextMatching, attrMatching, attrEq } = require("./el");
const { retry } = require("./retry");

/**
 * @typedef {{
 *   retryIntervalMs: number;
 *   retryDurationMs: number;
 *   baseUrl: string;
 * }} BotOpts
 */

/**
 * @typedef { import("puppeteer").ElementHandle<HTMLElement> } El
 */

/**
 *
 * @param {By} by
 * @param {string} msg
 * @returns
 */
const wrapErr = (by, msg) => (err) => { throw new Error(`${by} ${msg}, with cause\n${err}`); }

class Bot {

  /**
   *
   * @param {import("puppeteer").Page} page
   * @param {BotOpts} botOpts
   */
  constructor(page, botOpts) {
    /**
     * @type {import("puppeteer").Page}
     */
    this.page = page;
    /**
     * @type {BotOpts}
     */
    this.botOpts = botOpts;
  }

  /**
   *
   * @param {import("puppeteer").Page} page
   * @param {BotOpts} botOpts
   */
  static make(page, botOpts) {
    return new Bot(page, botOpts);
  }

  /**
   *
   * @param {(_ : BotOpts) => BotOpts} f
   */
  withBotOpts(f) {
    return new Bot(this.page, f({ ...this.botOpts }));
  }

  /**
   *
   * @param {string} absoluteUrl
   */
  async goto(absoluteUrl) {
    await this.page.goto(absoluteUrl);
  }

  /**
   *
   * @param {string} relativeUrl
   */
  async gotoRelative(relativeUrl) {
    await this.page.goto(`${this.botOpts.baseUrl}${relativeUrl}`);
  }

  /**
  *
  * @param {By} by
  * @returns {Promise<El>}
  */
  async shouldExist(by) {
    const page = this.page;
    return await retry(
      {
        durationInMs: this.botOpts.retryDurationMs,
        intervalInMs: this.botOpts.retryIntervalMs,
      },
      () => find(page, by).then(exists).catch(wrapErr(by, "shouldExist"))
    );
  }

  /**
   *
   * @param {By} by
   * @returns {Promise<El>}
   */
  async shouldBeVisible(by) {
    const page = this.page;
    return await retry(
      {
        durationInMs: this.botOpts.retryDurationMs,
        intervalInMs: this.botOpts.retryIntervalMs,
      },
      () => find(page, by).then(exists).then(visible).catch(wrapErr(by, "shouldBeVisible"))
    );
  }

  /**
   *
   * @param {By} by
   * @returns {Promise<El>}
   */
  async shouldNotBeVisible(by) {
    const page = this.page;
    return await retry(
      {
        durationInMs: this.botOpts.retryDurationMs,
        intervalInMs: this.botOpts.retryIntervalMs,
      },
      () => find(page, by).then(hidden).catch(wrapErr(by, "shouldNotBeVisible"))
    );
  }

  /**
   *
   * @param {By} by
   * @returns {Promise<El>}
   */
  async shouldBeStable(by) {
    const page = this.page;
    return await retry(
      {
        durationInMs: this.botOpts.retryDurationMs,
        intervalInMs: this.botOpts.retryIntervalMs,
      },
      () => find(page, by).then(exists).then(visible).then(stable).catch(wrapErr(by, "shouldBeStable"))
    );
  }

  /**
 *
 * @param {By} by
 * @returns {Promise<El>}
 */
  async shouldBeEditable(by) {
    const page = this.page;
    return await retry(
      {
        durationInMs: this.botOpts.retryDurationMs,
        intervalInMs: this.botOpts.retryIntervalMs,
      },
      () => find(page, by).then(exists).then(visible).then(stable).then(enabled).catch(wrapErr(by, "shouldBeEditable"))
    );
  }

  /**
  *
  * @param {By} by
  * @returns {Promise<El>}
  */
  async shouldBeClickable(by) {
    const page = this.page;
    return await retry(
      {
        durationInMs: this.botOpts.retryDurationMs,
        intervalInMs: this.botOpts.retryIntervalMs,
      },
      () => find(page, by).then(exists).then(visible).then(stable).then(enabled).catch(wrapErr(by, "shouldBeClickable"))
    );
  }

  /**
   *
   * @param {By} by
   * @returns {Promise<El>}
   */
  async shouldBeFirstToClick(by) {
    const page = this.page;
    return await retry(
      {
        durationInMs: this.botOpts.retryDurationMs,
        intervalInMs: this.botOpts.retryIntervalMs,
      },
      () => find(page, by).then(exists).then(visible).then(stable).then(enabled).then(firstToReceiveClick).catch(wrapErr(by, "shouldBeClickable"))
    );
  }

  /**
   *
   * @param {By} by
   * @param {string} s
   * @returns {Promise<El>}
   */
  async shouldHaveInnerTextEq(by, s) {
    const page = this.page;
    return await retry(
      {
        durationInMs: this.botOpts.retryDurationMs,
        intervalInMs: this.botOpts.retryIntervalMs,
      },
      () => find(page, by).then(exists).then(innerTextEq(s)).catch(wrapErr(by, "shouldHaveInnerTextEq"))
    );
  }

  /**
   *
   * @param {By} by
   * @param {RegExp} r
   * @returns {Promise<El>}
   */
  async shouldHaveInnerTextMatching(by, r) {
    const page = this.page;
    return await retry(
      {
        durationInMs: this.botOpts.retryDurationMs,
        intervalInMs: this.botOpts.retryIntervalMs,
      },
      () => find(page, by).then(exists).then(innerTextMatching(r)).catch(wrapErr(by, "innerTextMatching"))
    );
  }

  /**
   *
   * @param {By} by
   * @param {string} k
   * @param {string} v
   * @returns {Promise<El>}
   */
  async shouldHaveAttributeEq(by, k, v) {
    const page = this.page;
    return await retry(
      {
        durationInMs: this.botOpts.retryDurationMs,
        intervalInMs: this.botOpts.retryIntervalMs,
      },
      () => find(page, by).then(exists).then(attrEq(k, v)).catch(wrapErr(by, "shouldHaveAttributeEq"))
    );
  }

  /**
   *
   * @param {By} by
   * @param {string} k
   * @param {RegExp} r
   * @returns {Promise<El>}
   */
  async shouldHaveAttributeMatching(by, k, r) {
    const page = this.page;
    return await retry(
      {
        durationInMs: this.botOpts.retryDurationMs,
        intervalInMs: this.botOpts.retryIntervalMs,
      },
      () => find(page, by).then(exists).then(attrMatching(k, r)).catch(wrapErr(by, "shouldHaveAttributeMatching"))
    );
  }


  /**
   *
   * @param {By} by
   * @param {string} v
   * @returns {Promise<El>}
   */
  async shouldHaveValueEq(by, v) {
    return await this.shouldHaveAttributeEq(by, "value", v);
  }

  /**
   *
   * @param {By} by
   * @param {RegExp} r
   * @returns {Promise<El>}
   */
  async shouldHaveValueMatching(by, r) {
    return await this.shouldHaveAttributeMatching(by, "value", r);
  }

  /**
   *
   * @param {By} by
   */
  async click(by) {
    try {
      const h = await this.shouldBeClickable(by);
      await h.click();
    } catch (err) {
      throw new Error(`${by} click failed, cause\n${err}`);
    }
  }

  /**
   *
   * @param {By} by
   * @param {string} txt
   */
  async type(by, txt) {
    try {
      const h = await this.shouldBeStable(by);
      await h.type(txt);
    } catch (err) {
      throw new Error(`${by} type failed, cause\n${err}`);
    }
  }

  /**
   *
   * @param {By} by
   * @param {string} s
   */
  async scrollIntoView(by) {
    try {
      const h = await this.shouldExist(by);
      await h.scrollIntoView();
    } catch (err) {
      throw new Error(`${by} scrollIntoView failed,\ causen${err}`);
    }
  }
}

module.exports = {
  Bot
}
