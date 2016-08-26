'use strict';
require('dotenv').config()
const whosOut = require('./whosOut')
const schedule = require('node-schedule')
const Botkit = require('botkit')
const port = process.env.PORT

const controller = Botkit.slackbot({
  debug: false
})
controller.setupWebserver(port, function(err, expresswebserver){
  if (err) {
    console.log(err);
  }
  else {
    console.log('Server is attached to port', port);
  }
})

const rule = new schedule.RecurrenceRule()
rule.dayOfWeek = 1
rule.hour = 8

const j = schedule.scheduleJob(rule, function(err) {
  if (err) {
    console.log(err)
  }
  whosOut()
})

console.log('Messages scheduled for Mondays at 8am!');
