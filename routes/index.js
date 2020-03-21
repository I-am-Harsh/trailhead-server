var express = require('express');
var router = express.Router();


const cheerio = require('cheerio');
const puppeteer = require('puppeteer');



/* GET home page. */
router
.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})

.get('/favicon.ico', (req, res) => res.status(204))




.get("/profile", async (req,res,next) => {

  const userId = req.params.profile;
  console.log(req.params.profile);
  const url = "https://trailblazer.me/id/" + userId;
// function to load the page
  async function getPage(url) {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle0'});
    // initialize i
    var i = 1;

    // if i then loop
    while(i){
      const [button] = await page.$x("//button[contains(., 'Show More')]");
      if (button) {
        await button.click();
        await page.waitFor(2000);
      }
      // if show more is not there then set i to 0
      else{
        i = 0;
      }
    }

    const html = await page.content(); // serialized HTML of page DOM.
    await browser.close();
    return html;
  }


  // using cheerio to scrape
  const html = await getPage(url);
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
    badges[i] = i + 1 + " : " + $(this).text();
  });

  // send
  console.log(stats);
  res.json({"Badges" : stats[0], "Points" : stats[1], "trails" : stats[2], "Badges Names" : badges});

})

.get('/resp', (req, res, next) => {
  res.send("Hi this is some response");

});



module.exports = router;
