var express = require('express');
var router = express.Router();

const request = require('request');
const cheerio = require('cheerio');

/* GET home page. */
router
.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})

.get('/favicon.ico', (req, res) => res.status(204))

.get('/:profile', (req,res,next) => {
  // var site = "https://trailblazer.me/id/" + req.params.profile;
  // var site = "http://chriskimdev.com/";
  // console.log(site);
  
  request('https://trailblazer.me/id/akganesa', (error, response, html) => {
    // Checking that there is no errors and the response code is correct
    if(!error && response.statusCode === 200){
        // Declaring cheerio for future usage
        const $ = cheerio.load(html);
        
        // Looking at the inspector or source code we will select the following id value 
        const siteHeading = $('div') ;

        // Showing our result on the console
        console.log("=========================================== HTML ===========================================");
        console.log(siteHeading.html());
        console.log("=========================================== TEXT ===========================================");
        console.log(siteHeading.text());
        res.json(siteHeading.text());
    }
  });
})

module.exports = router;
