const puppeteer = require("puppeteer")
const {describe, test, expect, it} = require("@jest/globals");
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
test("Headless test", async () => {
    const browser = await puppeteer.launch({
        headless: true
    }) // если поставить false, то запустится браузер
    const page = await browser.newPage()
    await page.goto("http://localhost:8080/#/admin")
    await page.waitForSelector(".form-select")
    await page.type(".form-select", "Anatoliy Green")
    await page.click("#login-btn");

    await delay(500);
    await page.waitForSelector(".card-title")

    await page.click("a[href='#/exchange']");
    //await page.waitForSelector("#input_AAPL")
    await delay(1000);
    //await page.type("#input_AAPL", "1")
    await page.waitForSelector("#person_money");
    const money_before_buy = await page.$eval("#person_money", e => e.innerHTML.split(' ')[1]);
    const aapl_price = await page.$eval("#price_AAPL", e => e.innerHTML.split(' ')[1]);

    await page.click("#buy_AAPL");
    await page.waitForSelector("#person_money")
    let tmp = Number(Number(money_before_buy)-Number(aapl_price)).toFixed(2);
    await delay(1000);
    const a = await page.$eval("#person_money", e =>
        e.innerHTML)
    expect(a).toBe("Money: "+Number(tmp).toFixed(2));
    await delay(1000);
    //SELLING
    const money_before_sell = await page.$eval("#person_money", e => e.innerHTML.split(' ')[1]);
    const aapl_price_sell = await page.$eval("#price_AAPL", e => e.innerHTML.split(' ')[1]);
    await page.click("#sell_AAPL");
    await page.waitForSelector("#person_money")
    let tmp_sell = Number(Number(money_before_sell)+Number(aapl_price_sell)).toFixed(2);
    await delay(1000);
    await page.screenshot({path: 'scr1.png'});
    const b = await page.$eval("#person_money", e =>
        e.innerHTML)
    expect(b).toBe("Money: "+Number(tmp_sell).toFixed(2));


    await page.close();
    await browser.close();
}, 18000)