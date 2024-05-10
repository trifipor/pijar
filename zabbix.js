const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer');
require('dotenv').config();

const token = process.env.TOKEN_TELE;

const sleep = ms => new Promise(res => setTimeout(res, ms));
const bot = new TelegramBot(token, { polling: true });

const username = `${process.env.USER_ZABBIX}`;
const password = `${process.env.PASS_ZABBIX}`;
const dashboardUrl = `${process.env.DASH_URL_ZABBIX}`;
const zabbixUrl = `${process.env.LOGIN_URL_ZABBIX}`;

bot.on('message', async (msg) => {

  if (msg.text.toLowerCase() === '.zabbix') {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1300 }); 

    await page.goto(zabbixUrl);
    await page.type('#name', username);
    await page.type('#password', password);

    await Promise.all([
        page.waitForNavigation(),
        page.click('#enter'),
    ]);

    await page.goto(dashboardUrl);

    await sleep(3000);
    
    const screenshot = await page.screenshot({ fullPage: true });
    bot.sendPhoto(msg.chat.id, screenshot);

    await browser.close();
  }
});


