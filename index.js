'use strict';
const whosOut = require('./whosOut')
const schedule = require('node-schedule')
const http = require('http')

const port = process.env.PORT || 3000

const server = http.createServer(handleRequest)
server.listen(port, function(){
  console.log('Listening on port', port)
})

function handleRequest(req, res){
  res.end('Ok')
}


const rule = new schedule.RecurrenceRule()
rule.dayOfWeek = 1
rule.hour = 8
// Don't forget the minute!
rule.minute = 0


const j = schedule.scheduleJob(rule, function(err) {
  if (err) {
    console.log(err)
  }
  whosOut()
})

console.log('PTO Bot for',process.env.BAMBOOHR_SUBDOMAIN)

console.log('Messages scheduled for Mondays at 8am!');
