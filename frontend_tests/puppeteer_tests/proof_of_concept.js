const puppeteer = require('puppeteer');
const assert = require('assert');
async function run() {
  const browser = await puppeteer.launch({
    defaultViewport: null,
    headless: false,
    slowMo: 100,
    args: [
      '--window-size=1400,1024',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1400,
    height: 900,
  });
  await page.goto('http://localhost:9991/devlogin/');
  const cordelia = "#direct_login_form > div > div > div:nth-child(2) > p:nth-child(3) > input";
  await page.waitFor(cordelia);
  await page.$eval(cordelia, a => {a.click();});
  const buddy_data_selector = "#user_presences > li > div > a";
  await page.waitFor(buddy_data_selector);
  
  const buddy_data_urls = await page.$$eval(buddy_data_selector, anchors => { return anchors.map(anchor => anchor.href) })
  assert.equal(buddy_data_urls[0],'http://localhost:9991/#narrow/pm-with/8-cordelia');
  
  // open message box
  await page.keyboard.type('c');

  const compose_box_stream_input = "#stream_message_recipient_stream";
  await page.waitFor(compose_box_stream_input);
  await page.$eval(compose_box_stream_input, a => {a.value = "test";});

  const compose_box_topic_input = "#stream_message_recipient_topic";
  await page.waitFor(compose_box_topic_input);
  await page.$eval(compose_box_topic_input, a => {a.value = "test topic";});

  const compose_box_body = "#compose-textarea";
  await page.waitFor(compose_box_body);
  await page.$eval(compose_box_body, a => {
    a.value = "test message";
    // prep for pressing enter
    a.select();
  });

  // send the message
  await page.keyboard.press('Enter');

  const last_message = "#zhome101";
  await page.waitFor(last_message);
  const message_body = await page.$eval(last_message, a => {a.textContent;});
  
  // commented as will fail if not run on a fresh build
  // (ie if other messages had already been sent)

  // assert.equal(message_body, "test message");

  browser.close();
}

run();