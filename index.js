'use strict';
const whosOut = require('./whosOut')
const schedule = require('node-schedule')
const moment = require('moment-timezone')


const rule = new schedule.RecurrenceRule()
rule.dayOfWeek = 5
rule.hour = 15
rule.minute = 40

const j = schedule.scheduleJob(rule, function(err) {
  if (err) {
    console.log(err)
  }
  whosOut()
})
console.log('PTO Bot for',process.env.BAMBOOHR_SUBDOMAIN)

console.log('Messages scheduled for Mondays at 8am!');

console.log('server Time', moment().format('hh:mm'));

console.log('EDT Time',moment().tz('America/New_York').format('hh:mm'));

// whosOut()
