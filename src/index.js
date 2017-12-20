const puppeteer = require('puppeteer');
const { ServerStyleSheet, StyleSheetManager } = require('styled-components');
const StyleSheet = require('styled-components/lib/models/StyleSheet');
const { renderToString } = require('react-dom/server');
const React = require('react');

StyleSheet.default.reset(true); // reset to use server stylesheet

module.exports = async element => {
  const sheet = new ServerStyleSheet();
  const html = renderToString(
    React.createElement(StyleSheetManager, { sheet: sheet.instance }, element)
  );

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const css = sheet.getStyleTags();

  await page.evaluate(
    (html, css) => {
      window.document.body.innerHTML = html;
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
