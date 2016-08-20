'use strict';

const whosOut = require('./whosOut')
const schedule = require('node-schedule')

const rule = new schedule.RecurrenceRule()
rule.dayOfWeek = 1
rule.hour = 8

const j = schedule.scheduleJob(rule, function(err) {
  if (err) {
    console.log(err)
  }
  whosOut()
})
