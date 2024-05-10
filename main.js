const token = "7111935937:AAFUV0iLd6CvQZHYKVo7mOUL0ILOOh1yUmo";
const TelegramBot = require("node-telegram-bot-api");
require('dotenv').config();


const options  = {
    polling: true
}
const bot = new TelegramBot(token, options)


const NOC_MPP_ENDPOINT = "https://pijaroncloud.jakarta.go.id/noc/1/main"
const PANEL_MPP_ENDPOINT = "https://pijaroncloud.jakarta.go.id/noc/2/main"

const prefix = '.'

const ceksuhunoc = new RegExp(`^${prefix}noc`)
const ceksuhupanel = new RegExp(`^${prefix}panel`)
const postkinerja = new RegExp(`^${prefix}kinerja`)
const chatID = '988675972'



bot.onText(ceksuhunoc, async(callback) => {

    const apiCall_NOC = await fetch(NOC_MPP_ENDPOINT)

    const {
        data : {
            temp,timeon,humd
    }} = await apiCall_NOC.json()

    const resultText = `
[Temperatur NOC]
temp : ${temp}
humd : ${humd}
update : ${timeon}`

    bot.sendMessage(callback.from.id, resultText)

})

bot.onText(ceksuhupanel, async(callback) => {

    const apiCall_PANEL = await fetch(PANEL_MPP_ENDPOINT)

    const {
        data : {
            temp,timeon,humd
    }} = await apiCall_PANEL.json()

    const resultText = `
[Temperatur PANEL]
temp : ${temp}
humd : ${humd}
update : ${timeon}`

    bot.sendMessage(callback.from.id, resultText)
})

async function sendMessageNOC() {

    const apiCall_NOC = await fetch(NOC_MPP_ENDPOINT)

    const {
        data : {
            temp,timeon,humd
    }} = await apiCall_NOC.json()

    const resultText = `
[Temperatur NOC]
temp : ${temp}
humd : ${humd}
update : ${timeon}`
    bot.sendMessage(chatID, resultText);
}
// setInterval(sendMessageNOC, 5000);

async function sendMessagePANEL() {

    const apiCall_PANEL = await fetch(PANEL_MPP_ENDPOINT)

    const {
        data : {
            temp,timeon,humd
    }} = await apiCall_PANEL.json()

    const resultText = `
[Temperatur PANEL]
temp : ${temp}
humd : ${humd}
update : ${timeon}`
    bot.sendMessage(chatID, resultText);
}
// setInterval(sendMessagePANEL, 5000);




//============================GROUP CEK BOT START============================




// bot.on('message', (msg) => {
//     const chatId = msg.chat.id; // This is the group ID
//     console.log('Group ID:', chatId);
//     bot.sendMessage(chatId, `The group ID is: ${chatId}`);
// });

const groupId = '-4116303139' //GROUP ID CEK BOT

async function sendGroupMessageNOC() {

    const apiCall_NOC = await fetch(NOC_MPP_ENDPOINT)

    const {
        data : {
            temp,timeon,humd
    }} = await apiCall_NOC.json()

    const resultText = `
[Temperatur NOC]
temp : ${temp}
humd : ${humd}
update : ${timeon}`
    

    if (temp >= 20) {
        bot.sendMessage(groupId, `WARNING!!! TEMP NOC ${temp} !!`)
    } else {
        bot.sendMessage(groupId, resultText);
    }
}

setInterval(sendGroupMessageNOC, 10000);

async function sendGroupMessagePANEL() {

    const apiCall_PANEL = await fetch(PANEL_MPP_ENDPOINT)

    const {
        data : {
            temp,timeon,humd
    }} = await apiCall_PANEL.json()

    const resultText = `
[Temperatur PANEL]
temp : ${temp}
humd : ${humd}
update : ${timeon}`

    if (temp >= 20) {
        bot.sendMessage(groupId, `WARNING!!! TEMP PANEL ${temp} !!`)
    } else {
        bot.sendMessage(groupId, resultText);
    }

}
setInterval(sendGroupMessagePANEL, 10000);



//========================BOT KINERJA===================

bot.onText(postkinerja, (callback) => {




function isWeekday(date) {
    const dayOfWeek = date.getDay();
    return dayOfWeek > 0 && dayOfWeek < 6;
  }
  
  
  function postData(date) {
    const formattedDate = date.getFullYear() + '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
    ('0' + date.getDate()).slice(-2);
  
  
    //sesuaikan data token dan akun
    const myHeaders = new Headers();
    myHeaders.append("sec-ch-ua", "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
    myHeaders.append("DNT", "1");
    myHeaders.append("Upgrade-Insecure-Requests", "1");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36");
    myHeaders.append("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");
    myHeaders.append("host", "pijaroncloud.jakarta.go.id");
    myHeaders.append("Cookie", "Cookie_3=value; TS016cd175=01b53461a6babed22075749f43f517d5d1b0bc394ad85686ccf8813d1cf60fbe92b67a9c9f6ad6ee37da58eca0cc001d52d105c480; XSRF-TOKEN=eyJpdiI6IkpKU1d3UDdwTDRiV3RuYjA5U2dKdmc9PSIsInZhbHVlIjoiMjRMaE9VMTNqdEkwa0RLV0RxSkwrMVJueFlWZ2RjRjFOeXdPR2NqVlYxXC9Sa1l3NzFwZjhNXC9NV1B5U0RkR0o4IiwibWFjIjoiZmNhY2NlNDAxMTc5NzAyZDVhMzE1ZThmYjY0Y2UyMjJmZmM2N2NmNDlhY2UxZDdjNTMxYTBkMGQ4ODEzODI0NSJ9; laravel_session=eyJpdiI6IkFqYWRPRkQ2ZldJQWtjOE1BdEFEc1E9PSIsInZhbHVlIjoidDhyTndwbEREOVlWMmNZZENDVno4ZUs2XC9FRm95RWhQdzBkTEVHeTFWQUhkRUpxOHdCZ0gzTDJzYmtQSzNXYjZoOE5RVm54d3RhSG1WakV6TU9nRUVpMHJ1WlhFWkp2bkZoS0NkbmZmQXVXQjFUNVBxem9ON2FmNjJSMVpFUnY4IiwibWFjIjoiNTgyMzg0YTc2NjQ0MGEwNzJiMWYzMTNmZjUzODk5MmMxMzI0ZDUxYjQwMDEzOWRlNGVlMWIyZTdkNmIxM2QyMiJ9; remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6IklUMmMyb0pLdzRzQ1wvUWJJc28zNU13PT0iLCJ2YWx1ZSI6ImNmTUhNWjF0b0o5NVwvcHlUa1l3Mzljd3VNWjdybEMrQXlpc2FHdjFJbXpQUTZ5OVFJOFlrUnRrN2VZd2o1MDFYZVBwS2FvcXhUZit3MlpwTzQyajZkNWI4bTBqMTM1aVo4RE9yQ0dISGZcL2RINHNEdERscStrb2E5RlZrTDNGMW9OaXBncGVCZmFuNXNnRWpiOE9KZ0tkZFFPNU41VXZmdzEwNitpVFJzV0FBYWhabEFkd095MGFOK3g2Yzl0MlRaNk5TZGpuTFwvVlArWTRUTzduQTgrV1NyZVI3S1wvU004S0VSaStDNGRTRUpNPSIsIm1hYyI6IjllN2U1MmUzZGRkMTU3MWJlNzhkYWQ0MWY1NjhjMzMzYTkyY2ZhMzZlNjA1YWFkMGNkOTVhMTA1M2FmODgwYTkifQ%3D%3D");
  
    const urlencoded = new URLSearchParams();
    urlencoded.append("_token", "Ar4fgLPFFbFIDH0ExTBIAmBiSMlsxhGe6yuHt2wv");
    urlencoded.append("id_ta", "39");
    urlencoded.append("tanggal", `${formattedDate}`);
    urlencoded.append("up1", "Melaksanakan Monitoring Jaringan di Dinas PMPTSP Provinsi DKI Jakarta");
    urlencoded.append("up2", "Pengarahan Teknis Dari Koordinator");
    urlencoded.append("up3", "Mempersiapkan peralatan pekerjaan pemeliharaan jaringan LAN/Printer/PC");
    urlencoded.append("up4", "Melakukan Koordinasi TIM Teknisi Tenaga Ahli");
    urlencoded.append("up5", "Membuat Laporan harian pelaksanaan pekerjaan");
    urlencoded.append("up6", "");
    urlencoded.append("verifikasi", "0");
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
    };
  
    fetch("https://pijaroncloud.jakarta.go.id/laporan/kinerja/save", requestOptions)
      .then((response) => response.text())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.error(error));
  
    
  }
  
  
  const startDate = new Date();
  const endDate = new Date(startDate);
  //edit + number(jumlah hari pada bulan)
  endDate.setDate(endDate.getDate() + 6);
  
  //looping weekday
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    if (isWeekday(date)) {
        postData(date);
    }
  }
  
    bot.sendMessage(callback.from.id, 'bot kinerja activated')
    console.log('bot kinerja activated')
})




// Listen for any kind of message. Here we're assuming you want to send a photo in response to any message
bot.on('message', async(msg) => {
    const chatId = msg.chat.id;
    console.log(msg)

    const gambar = msg.document.file_name



    // Replace 'path/to/your/image.jpg' with the actual path to the image you want to send
    bot.sendPhoto(chatId, "gambar", { caption: 'Here is your photo!' })
        .then(() => {
            console.log('Photo sent!');
        })
        .catch((error) => {
            console.log('error')
            console.error(error);
        });
    // console.log(gambar)
});


//==========================BOT FOTO=====================

