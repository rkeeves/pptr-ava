/**
 * @typedef { import("puppeteer").ElementHandle<HTMLElement> } El
 */

/**
 * @template A
 * @typedef { (_: A) => Promise<A> } Condition
 */

/**
 *
 * @param { import("puppeteer").Page } page
 * @param { import("./by") } by
 * @returns { Promise<El | null> }
 */
const find = (page, by) => by.isCss() ? findCss(page, by.selector) : findXPath(page, by.selector);

/**
 *
 * @param { import("puppeteer").Page } page
 * @param { string } css
 * @returns { Promise<El | null> }
 */
const findCss = (page, css) => page.$(css)
  .catch(err => { throw new Error(`findCss ${by} failed, with cause error:\n${err}`) });

/**
 *
 * @param { import("puppeteer").Page } page
 * @param { string } xpath
 * @returns { Promise<El | null> }
 */
const findXPath = (page, xpath) => page.$x(xpath).then(xs => {
  if (xs.length == 0) {
    return null;
  } else if (xs.length == 1) {
    return xs[0];
  } else {
    throw new Error(`Multiple possible elements (${xs.length}) are located by this xpath`);
  }
})
  .catch(err => { throw new Error(`findXPath ${by} failed, with cause error:\n${err}`) });


/**
 * @template A
 * @template B
 * @typedef { (_: A) => Promise<B> } Act<A, B>
 */

/**
 * @type {Condition<El>}
 */
const exists = async h => {
  if (h == null) { throw new Error(`exists failed, was null`); }
  return h;
}

/**
 * @type {Condition<El>}
 */
const missing = async h => {
  if (h == null) { return h; }
  throw new Error(`missing failed, was non null`);
}

/**
 * @type {Condition<El>}
 */
const visible = async h => {
  const x = await h.isVisible().catch(err => { throw new Error(`visible failed with cause\n${err}`); });
  if (!x) { throw new Error(`visible failed, was hidden`); }
  return h;
};

/**
 * @type {Condition<El>}
 */
const hidden = async h => {
  if (h == null) return h;
  const x = await h.isHidden().catch(err => { throw new Error(`hidden failed with cause\n${err}`); });
  if (!x) { throw new Error(`hidden failed, was visible`); }
  return h;
};

/**
 *
 * @param {HTMLElement} e
 * @returns {boolean}
 */
const browserside_script_isBoundingBoxStable = e => {
  const eq = (a, b) => a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
  if (document.visibilityState === 'hidden') {
    return true;
  }
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      const r1 = e.getBoundingClientRect();
      window.requestAnimationFrame(() => {
        const r2 = e.getBoundingClientRect();
        resolve(eq(r1, r2))
      });
    });
  });
}

/**
 * @type {Condition<El>}
 */
const stable = async h => {
  const x = await h.evaluate(browserside_script_isBoundingBoxStable)
    .catch(err => { throw new Error(`stable failed with cause\n${err}`); });
  if (x) { return h; }
  throw new Error(`stable failed, boundingBox was changing across animation frames`);
};


/**
 *
 * @param {HTMLElement} e
 * @returns {boolean}
 */
const browserside_script_isFirstToReceiveClick = e => {
  const rect = e.getBoundingClientRect();
  const x_center = rect.x + (rect.width / 2);
  const y_center = rect.y + (rect.height / 2);
  const xs = document.elementsFromPoint(x_center, y_center);
  return xs[0] == e;
}


/**
 * @type {Condition<El>}
 */
const firstToReceiveClick = async h => {
  const x = await h.evaluate(browserside_script_isFirstToReceiveClick)
    .catch(err => { throw new Error(`firstToReceiveClick failed with cause\n${err}`); });
  if (x) { return h; }
  throw new Error(`firstToReceiveClick failed, other element would receive the click`);
};

/**
 * @param {string} v
 * @returns {Condition<El>}
 */
const innerTextEq = (v) => async h => {
  const x = await h.evaluate(e => e.innerText);
  if (x == v) { return h; }
  throw new Error(`innerTextEq failed expected '${v}' but was '${x}'`);
};

/**
 * @param {RegExp} r
 * @returns {Condition<El>}
 */
const innerTextMatching = (r) => async h => {
  const x = await h.evaluate(e => e.innerText);
  if (r.test(x)) { return h; }
  throw new Error(`innerTextMatching failed using regex '${r}' but text was '${x}'`);
};

/**
 * @type {Condition<El>}
 */
const enabled = async h => {
  const x = await h.evaluate((e) => e.hasAttribute('disabled'));
  if (x) { throw new Error(`enabled failed, it was disabled`); }
  return h;
};

/**
 * @param {string} k
 * @param {string} v
 * @returns {Condition<El>}
 */
const attrEq = (k, v) => async h => {
  const x = await h.evaluate((e, key) => e.getAttribute(key), k);
  if (x == v) { return h; }
  throw new Error(`attr failed using key '${k}' and expected '${v}' but value was '${x}'`);
};

/**
 * @param {string} k
 * @param {RegExp} r
 * @returns {Condition<El>}
 */
const attrMatching = (k, r) => async h => {
  const x = await h.evaluate((e, key) => e.getAttribute(key), k);
  if (r.test(x)) { return h; }
  throw new Error(`attrMatching failed using key '${k}' and regex '${r}' but value was '${x}'`);
};


module.exports = { find, exists, missing, visible, hidden, stable, enabled, firstToReceiveClick, innerTextEq, innerTextMatching, attrEq, attrMatching }
