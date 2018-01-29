const puppeteer = require('puppeteer');
const { ServerStyleSheet, __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS } = require('styled-components');
const { renderToString } = require('react-dom/server');
const micro = require('micro');

const { StyleSheet } = __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS;

const HTML = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

let port = 0;
const server = micro(async (req, res) => HTML).listen(() => {
  port = server.address().port;
});

StyleSheet.reset(true);

module.exports = async element => {
  const sheet = new ServerStyleSheet();
  const html = renderToString(element);
  const css = sheet.instance.toHTML();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({
    width: 1280,
    height: 1024
  });

  await page.goto(`http://0.0.0.0:${port}`, {
    waitUntil: 'networkidle2'
  });

  await page.evaluate(
    (html, css) => {
      window.document.getElementById('root').innerHTML = html;
      window.document.head.insertAdjacentHTML('beforeend', css);
    },
    html,
    css
  );

  const png = await page.screenshot({
    omitBackground: true,
    fullPage: true,
    type: 'png'
  });

  await browser.close();

  return png;
};
