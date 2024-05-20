class By {
  /**
   *
   * @param {"css" | "xpath"} kind
   * @param {string} selector
   */
  constructor(kind, selector) {
    /**
     * @type { "css" | "xpath"}
     */
    this.kind = kind;
    /**
     * @type {string}
     */
    this.selector = selector;
  }

  /**
   *
   * @param {string} selector
   */
  static $css(selector) {
    return new By("css", selector);
  }

  /**
   *
   * @param {string} selector
   */
  static $xpath(selector) {
    return new By("xpath", selector);
  }

  /**
   *
   * @param {string} selector
   */
  static $text(text) {
    return new By("xpath", `//*[text()='${text}']`);
  }

  /**
   *
   * @param {string} testId
   */
  static $dataTest(testId) {
    return new By("css", `*[data-test='${testId}']`);
  }

  toString() {
    return `By(${this.kind}='${this.selector}')`;
  }

  isCss() {
    return this.kind == "css"
  }
}

module.exports = By;
