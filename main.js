import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import fs from 'fs';

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function getLinks(sUrl) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(sUrl);
    let urls = await page.evaluate(() => {
        let results = [];
        let items = document.querySelectorAll('a');
        console.log(items);

        items.forEach((item) => {
            const url = item.getAttribute('href');
            const text = decodeURI(url);
            results.push({
                url,
                text
            });
        });
        return results;
    });
    browser.close();
    return urls;
}

async function writeImage(res, sFile) {
    if (!fs.statSync('./Downloads').isDirectory())
        fs.mkdirSync('./Downloads');
    if (sFile !== '../') {
        console.log('Téléchargement ' + sFile);
        const stream = fs.createWriteStream('./Downloads/' + sFile);
        stream.on("finish", () => {
            return;
        });
        res.body.pipe(stream);
    }

}

(async () => {
    const url = 'http://thumbnails.libretro.com/MAME/Named_Boxarts/';
    const links = await getLinks(url);
    asyncForEach(links, async (link, i) => {
        //console.table({ "url": link.url, "text": link.text });
        const res = await fetch(url + link.url)
        await writeImage(res, link.text);
    });
})();