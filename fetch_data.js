const fs = require('fs')
const axios = require('axios')
const puppeteer = require('puppeteer');
const talib = require('ta.js')

const addToken = async (name, link) => {
    const browser = await puppeteer.launch({headless: 'new'});
    const [page] = await browser.pages();
    await page.goto(link, { waitUntil: 'networkidle0', timeout: 180000});
    const bodyText = await page.evaluate(() => document.body.innerText);
    await page.close()
    var datas = JSON.parse(bodyText).stats
    var chart1UI = []
    datas.forEach(item => {
        chart1UI.push({x: item[0] / 1000, y: item[1]})
    })
    var seriesData = [{name: 'candle', type: 'candlestick',data: chart1UI}]
    for(const time of [1,2,4]) {
        var data = []
        for(var i=0; i<datas.length;i+=time) {
            data.push(datas[i])
        }

        var emas = talib.ema(data.map(i => i[1]), 400)
        var UI = []
        for(var x=0;x<emas.length;x+=1) {
            UI.unshift({
                y: emas[emas.length - 1 - x],
                x: data[data.length - 1 - x][0] / 1000
            })
        }
        seriesData.push({
            name: `line${time}`,
            type: 'line',
            data: UI
        })
    }
    fs.writeFileSync(`./public/chart_data/${name}.json`, JSON.stringify(seriesData))
}

module.exports = addToken;