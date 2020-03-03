var express = require('express');
var router = express.Router();

const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');

/* GET home page. */
router
.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})

.get('/favicon.ico', (req, res) => res.status(204))



// invoke this when the user goes to a certain profile
// using prem league site for example
.get('/:profile', (req, res, next) =>{
  // const url = 'https://www.premierleague.com/stats/top/players/goals?se=-1&cl=-1&iso=-1&po=-1?se=-1';
  const table = [];
  request('https://www.premierleague.com/stats/top/players/goals?se=-1&cl=-1&iso=-1&po=-1?se=-1', (error, response, html) => {
        // const html = response.data;
        const $ = cheerio.load(html)
        const statsTable = $('.statsTableContainer > tr');
        const topPremierLeagueScorers = [];

        statsTable.each(function () {
          const rank = $(this).find('.rank > strong').text();
          const playerName = $(this).find('.playerName > strong').text();
          const nationality = $(this).find('.playerCountry').text();
          const goals = $(this).find('.mainStat').text();

          topPremierLeagueScorers.push({
            rank,
            name: playerName,
            nationality,
            goals,
          });
        });

        console.log(topPremierLeagueScorers);
        res.json(topPremierLeagueScorers);
      })
});



module.exports = router;
