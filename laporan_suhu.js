const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer');
require('dotenv').config();


const token = process.env.TOKEN_TELE
const bot = new TelegramBot(token, { polling: true });

const ENDPOINT_NOC = process.env.ENDPOINT_NOC
const ENDPOINT_NOC_BACKUP = process.env.ENDPOINT_NOC_BACKUP
const ENDPOINT_PANEL = process.env.ENDPOINT_PANEL

const chatID = process.env.CHAT_ID

const prefix = '.'
const ceksuhunoc = new RegExp(`^${prefix}mon`)

const sleep = ms => new Promise(res => setTimeout(res, ms));

const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();

const day = now.getDate();
const month = now.toLocaleString('default', { month: 'long' });
const year = now.getFullYear();

var tgl_report = `${day} ${month} ${year}`

if (minutes > 0) {
  var report_hours = `${hours}:00`
}
var range_hours = now.getHours() + 1;
var range_report = `${range_hours}:00`



bot.onText(ceksuhunoc, async (msg) => {

  const apiCall_NOC = await fetch(ENDPOINT_NOC)
  const apiCall_NOC_BACKUP = await fetch(ENDPOINT_NOC_BACKUP)
  const apiCall_PANEL = await fetch(ENDPOINT_PANEL)
  const urlSuhu = process.env.URL_SUHU_V2

  let status = "Normal";

  try {
    const {
      data : {
          temp,timeon,humd,id
  }} = await apiCall_NOC.json()

  var noc_temp = temp;
  var noc_humd = humd;
  } catch (error) {
    console.log(error)
    status = "Offline";
  }

  try {
    const {
      data : {
          temp,timeon,humd,id
  }} = await apiCall_NOC_BACKUP.json()
  var noc_backup_temp = temp;
  var noc_backup_humd = humd;
  } catch (error) {
    console.log(error)
    status = "Offline";
  }

  try {
    const {
      data : {
          temp,timeon,humd,id
  }} = await apiCall_PANEL.json()
  var panel_temp = temp;
  var panel_humd = humd;
  } catch (error) {
    console.log(error)
    status = "Offline";
  }


  const chatId = msg.chat.id;
  const caption = 
`Assalamualaikum, permisi bpk/ibu , Izin menyampaikan

Info Piket Malam:
  
Pengecekan Monitoring Suhu Server MPP 
Tanggal : ${tgl_report}
Jam : ${report_hours} - ${range_report}

Monitoring Suhu dan Kelembaban
                      Temperature Humidity Status
Ruang NOC        ${noc_temp}c            ${noc_humd}%     ${status}
NOC (Backup)    ${noc_backup_temp}c            ${noc_backup_humd}%     ${status}
Ruang Panel      ${panel_temp}c             ${panel_humd}%     ${status}

Status Server : Normal
Terkendali Aman , dan akan terus di Pantau secara berkala 🙏🏻`;

  console.log("process screenshot suhu...")
  console.log(report_hours)
  console.log(range_report)

  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 }); // Set the viewport for desktop size
    await page.goto(urlSuhu, { waitUntil: 'load' });
    await sleep(3500);
    console.log("screenshot monitoring suhu has been sent")
    const screenshot = await page.screenshot({ fullPage: true });
    await bot.sendPhoto(chatId, screenshot, {caption: caption});
    await browser.close()

  } catch (error) {
    bot.sendMessage(chatId, 'Sorry, something went wrong. Please try again.');
  }
});

const username = `${process.env.USER_ZABBIX}`;
const password = `${process.env.PASS_ZABBIX}`;
const loginZabbix = `${process.env.LOGIN_URL_ZABBIX}`;
const dashboard_httpreq_zabbix = `${process.env.DASHBOARD_HTTPREQ_ZABBIX}`;
const dashboard_jakevoapp_zabbix = `${process.env.DASHBOARD_JAKEVO_APP}`;
const dashboard_epjlpbalkot_zabbix = `${process.env.DASHBOARD_EPJL_BALKOT_ZABBIX}`


bot.on('message', async (msg) => {

  if (msg.text.toLowerCase() === '.mon') {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1300 }); 
    
    await page.goto(loginZabbix);
    await page.type('#name', username);
    await page.type('#password', password);
    
    await Promise.all([
      page.waitForNavigation(),
      page.click('#enter'),
    ]);
    
    console.log('process screenshot http request...')
    await page.goto(dashboard_httpreq_zabbix);
    await sleep(3000);
    
    const screenshot = await page.screenshot({ fullPage: true });
    bot.sendPhoto(msg.chat.id, screenshot);
    console.log(msg.chat.id)
    console.log('screenshot httprequest has been sent')
    await browser.close();
  }
/*   if (msg.text.toLowerCase() === '.mon') {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 2100 }); 
    
    await page.goto(loginZabbix);
    await page.type('#name', username);
    await page.type('#password', password);
    
    await Promise.all([
      page.waitForNavigation(),
      page.click('#enter'),
    ]);
    
    console.log('process screenshot epjlp balkot...')
    await page.goto(dashboard_epjlpbalkot_zabbix);
    await sleep(3000);
    
    const screenshot = await page.screenshot({ fullPage: true });
    bot.sendPhoto(msg.chat.id, screenshot);
    console.log('screenshot epjlpbalkot has been sent')
    await browser.close();
  }
  if (msg.text.toLowerCase() === '.mon') {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 2100 }); 
    
    await page.goto(loginZabbix);
    await page.type('#name', username);
    await page.type('#password', password);
    
    await Promise.all([
      page.waitForNavigation(),
      page.click('#enter'),
    ]);
    
    console.log('process screenshot jakevoapp...')
    await page.goto(dashboard_jakevoapp_zabbix);
    await sleep(3000);
    
    const screenshot = await page.screenshot({ fullPage: true });
    bot.sendPhoto(msg.chat.id, screenshot);
    console.log('screenshot jakevoapp has been sent')
    await browser.close();
  } */
});

async function sendHTTP() {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1300 }); 
  
  await page.goto(loginZabbix);
  await page.type('#name', username);
  await page.type('#password', password);
  
  await Promise.all([
    page.waitForNavigation(),
    page.click('#enter'),
  ]);
  
  console.log('process screenshot http request...')
  await page.goto(dashboard_httpreq_zabbix);
  await sleep(3000);
  
  const screenshot = await page.screenshot({ fullPage: true });
  bot.sendPhoto(chatID, screenshot);
  console.log('screenshot httprequest has been sent')
  await browser.close();
  

}
setInterval(sendHTTP, 60000);

async function sendSuhu() {

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const day = now.getDate();
  const month = now.toLocaleString('default', { month: 'long' });
  const year = now.getFullYear();

  var tgl_report = `${day} ${month} ${year}`

  if (minutes > 0) {
    var report_hours = `${hours}:00`
  }
  var range_hours = now.getHours() + 1;
  var range_report = `${range_hours}:00`

  const apiCall_NOC = await fetch(ENDPOINT_NOC)
  const apiCall_NOC_BACKUP = await fetch(ENDPOINT_NOC_BACKUP)
  const apiCall_PANEL = await fetch(ENDPOINT_PANEL)
  const urlSuhu = process.env.URL_SUHU_V2


  let status = "Normal";

  try {
    const {
      data : {
          temp,timeon,humd,id
  }} = await apiCall_NOC.json()

  var noc_temp = temp;
  var noc_humd = humd;
  } catch (error) {
    console.log(error)
    status = "Offline";
  }

  try {
    const {
      data : {
          temp,timeon,humd,id
  }} = await apiCall_NOC_BACKUP.json()
  var noc_backup_temp = temp;
  var noc_backup_humd = humd;
  } catch (error) {
    console.log(error)
    status = "Offline";
  }

  try {
    const {
      data : {
          temp,timeon,humd,id
  }} = await apiCall_PANEL.json()
  var panel_temp = temp;
  var panel_humd = humd;
  } catch (error) {
    console.log(error)
    status = "Offline";
  }



  const caption = 
`Assalamualaikum, permisi bpk/ibu , Izin menyampaikan

Info Piket Malam:
  
Pengecekan Monitoring Suhu Server MPP 
Tanggal : ${tgl_report}
Jam : ${report_hours} - ${range_report}

Monitoring Suhu dan Kelembaban
                      Temperature Humidity Status
Ruang NOC        ${noc_temp}c            ${noc_humd}%     ${status}
NOC (Backup)    ${noc_backup_temp}c            ${noc_backup_humd}%     ${status}
Ruang Panel      ${panel_temp}c             ${panel_humd}%     ${status}

Status Server : Normal
Terkendali Aman , dan akan terus di Pantau secara berkala 🙏🏻`;

  console.log("process screenshot suhu...")
  

  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 }); // Set the viewport for desktop size
    await page.goto(urlSuhu, { waitUntil: 'load' });
    await sleep(3500);
    console.log("screenshot monitoring suhu has been sent")
    console.log(`report in ${hours}:${minutes}`)
    const screenshot = await page.screenshot({ fullPage: true });
    await bot.sendPhoto(chatID, screenshot, {caption: caption});
    await browser.close()

  } catch (error) {
    bot.sendMessage(chatID, 'Sorry, something went wrong. Please try again.');
  }
}

setInterval(sendSuhu, 60000);
