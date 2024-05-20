# pptr-ava

`AVA` + `puppeteer` + `vanilla JS` is a terrible combinations.

Here are some examples on how to ease the pain...

## How to run

Install

```
npm install
```

Run all tests

```
HEADLESS=false npx ava
```

Run one test by - for example - regex match

```
HEADLESS=false npx ava --match="*bot-example-00*"
```

## Configuration

You can create an `.env` file and control some settings:

```
BASE_URL=https://www.saucedemo.com
SLOWMO=0
HEADLESS=false
RETRY_DURATION_MS=3000
RETRY_INTERVAL_MS=300
BROWSER_HEIGHT=800
BROWSER_WIDTH=1024
```

But you can override the `project.config.js` too.

## Bot - aka hiding away low level Puppeteer calls

There is a test file called `bot-example.spec.js`.

It is about some usecases for `Bot` which is essentially a dumb OOP wrapper around the raw `Puppeteer.Page` instance.

For retrying, it uses internally a simplistic naive while loop.

In certain situations, you cannot rely on `puppeteer`'s requestAnimationFrame (`raf`) based polling.

So, in those cases you need to do something and this dumb while loop is what Selenium uses for example.

Most actions like `click` have a sequence of preconditions that must be met, before the action can be fired.

Like: `is must exist, be visible, and blabla`.

You can find these in the code as stupid `Promise` chains, like:

```javascript
find(page, by)
  .then(exists)
  .then(visible)
  .then(stable)
  .then(enabled)
```

Aka, the ElementHandle should exist, be visible etc.  ... you get the gist.

## Hook - aka hiding away low level AVA calls and setup/teardown

There's a test file called `hook-example.spec.js`.

It is about some usecases of resources which must be setup/teardown.

With `puppeteer` you are able to spawn a single `Browser` before all tests, and spawn `BrowserContext`s before each tests.

Due to how `AVA` works, managing these can be a bit of a bother, and you also have to teardown everything at the end.

This example shows a pretty naive, straightforward way of dealing with it.

To really see what's happening, do the following:

```
HEADLESS=false npx ava --match="*hook-example-*" --tap
```

And it'll do the test, but will also print out some line noise to stdout, like:

```
TAP version 13
# hook-example » setup projectConfig
# hook-example » setup browser
# hook-example » Base login
# hook-example » setup alfa for [hook-example-00] Red
# hook-example » Alfa login for [hook-example-00] Red
# hook-example » setup beta for [hook-example-00] Red
# hook-example » Beta login for [hook-example-00] Red
# hook-example » setup alfa for [hook-example-01] Blue
# hook-example » Alfa login for [hook-example-01] Blue
# hook-example » setup beta for [hook-example-01] Blue
# hook-example » Beta login for [hook-example-01] Blue
# hook-example » [hook-example-01] Blue
ok 1 - hook-example » [hook-example-01] Blue
# hook-example » Beta logout for [hook-example-01] Blue
# hook-example » teardown beta for [hook-example-01] Blue
# hook-example » Alfa logout for [hook-example-01] Blue
# hook-example » teardown alfa for [hook-example-01] Blue
# hook-example » [hook-example-00] Red
ok 2 - hook-example » [hook-example-00] Red
# hook-example » Beta logout for [hook-example-00] Red
# hook-example » teardown beta for [hook-example-00] Red
# hook-example » Alfa logout for [hook-example-00] Red
# hook-example » teardown alfa for [hook-example-00] Red
# hook-example » Base logout
# hook-example » teardown browser
# hook-example » teardown projectConfig
```

What is this nonsense above?

Well, behind the scenes the code does:
- before all `Browser` is setup
- before each `BrowserContext` `alfa` is setup
- before each `BrowserContext` `beta` is setup
- some test (there are 2 tests, `Red` and `Blue`)
- after each `BrowserContext` `beta` is teared down
- after each `BrowserContext` `alfa` is teared down
- after all `Browser` is teared down

So the `hook.js` offloads a lot of boilerplate code from you...

This example also shows how to add types at least on the code editor level via JSDoc (aka `t.context` can have a type).

These type shenanigans can be interesting if you are working with a repo which simply does not want to use TS _(yep, I hate vanilla JS too, but sometimes you are sitting on 10+ years old code which has millions of lines and you cannot simply `just add TS`)_.

## Closing words

I deeply, and wholeheartedly hate untyped vanilla JS BS, and `AVA`.

If you have to work with these things too, I can only say one thing:

[Don't give up, kiddo!](https://youtu.be/JnXi3SVJXbM?t=10)
