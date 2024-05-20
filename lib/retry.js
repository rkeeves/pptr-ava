/**
 * @template A
 * @param {{ durationInMs: number; intervalInMs: number; }} o
 * @param { () => Promise<A> } eff
 */
const retry = async ({ durationInMs, intervalInMs }, eff) => {
  const toMillis = hr => hr[0] * 1000 + hr[1] / 1000000;
  const start = process.hrtime();
  let lasterr = null;
  while (toMillis(process.hrtime(start)) < durationInMs) {
    try {
      return await eff();
    } catch (err) {
      lasterr = err;
    }
    try {
      await new Promise((resolve) => {
        setTimeout(resolve, intervalInMs);
      });
    } catch (err) {
      lasterr = new Error(`sleep via setTimeout failed, with cause error:\n${err}`);
    }
  }
  const elapsed = toMillis(process.hrtime(start));
  if (lasterr == null) {
    throw new Error(`retry failed after ${elapsed} ms, without cause error`);
  } else {
    throw new Error(`retry failed after ${elapsed} ms, with cause error\n${lasterr}`);
  }
}

module.exports = {
  retry
}
