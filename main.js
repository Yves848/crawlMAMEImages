import puppeteer from 'puppeteer'

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://thumbnails.libretro.com/MAME/Named_Boxarts/');
    let urls = await page.evaluate(() => {
        let results = [];
        let items = document.querySelectorAll('a');
        console.log(items);
        items.forEach((item) => {
            results.push({
                url: item.getAttribute('href'),
                text: item.innerHTML
            });
        });
    });
    browser.close();
    return results;
})();