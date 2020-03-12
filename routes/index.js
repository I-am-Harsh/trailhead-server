var express = require('express');
var router = express.Router();

const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
const puppeteer = require('puppeteer');
const select = require('puppeteer-select');


/* GET home page. */
router
.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})

.get('/favicon.ico', (req, res) => res.status(204))




.get("/:profile", async (req,res,next) => {

  // hardcoded for testing
  const url = "https://trailblazer.me/id/akganesa";

  // // function to load the page
  // async function getPage() {
  //   const browser = await puppeteer.launch({headless: true});
  //   const page = await browser.newPage();
  //   await page.goto(url, {waitUntil: 'networkidle0'});

  //   const [first_button] = await page.$x("//button[contains(., 'Show More')]");
  //   await first_button.click();
  //   while (
  //     (await (await page.$x("//button[contains(., 'Show More')]")).length) > 0
  //   ) {
  //     const [button] = await page.$x("//button[contains(., 'Show More')]");
  //     await button.click();
  //     await page.waitForResponse(response => response.status() === 200);
  //   }

  //   const html = await page.content(); // serialized HTML of page DOM.
  //   await browser.close();
  //   return html;
  // }



  // =====================================new code-===============================
  var html = '';
  const go = async () => {
    const browser = await puppeteer.launch({headless: true});
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    try {
      await page.goto(url, {
        waitUntil: "networkidle0"
      });
      const [first_button] = await page.$x("//button[contains(., 'Show More')]");
      await first_button.click();
      while (
        (await (await page.$x("//button[contains(., 'Show More')]")).length) > 0
      ) {
        const [button] = await page.$x("//button[contains(., 'Show More')]");
        await button.click();
        await page.waitForResponse(response => response.status() === 200);
        
      }
      html = await page.content();
      // console.log(html);
      browser.close();
      return;
    } catch (err) {
      console.log(err);
      browser.close();
      return;
    }
  };
  
  await go();

  // end==============================

  // using cheerio to scrape
  // const html = await go();
  const $ = cheerio.load(html);

  // initialising the arr
  var stats = [];
  var badges = [];

  // storing points,badges and trails
  $('c-lwc-tally').find('.tds-tally__count.tds-tally__count_success').each(function(i,elem){
    stats[i] = $(this).text();
  });

  // storing the names of the badges 
  $('figcaption').find('.tds-color_black').each(function(i,elem){
    badges[i] = i + " : " + $(this).text();
  });

  // send
  res.json({"Badges" : stats[0], "Points" : stats[1], "trails" : stats[2], "Badges Names" : badges});

});



module.exports = router;
